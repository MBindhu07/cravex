import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class UniversalDB {
  constructor() {
    this.data = {
      users: [],
      restaurants: [],
      foodItems: [],
      categories: [],
      orders: [],
      reviews: [],
      coupons: [],
      inventory: [],
      supportTickets: [],
      foodPolls: [],
      groupOrders: [],
      foodPassports: [],
      notifications: [],
      promotions: [],
    };
    this.loaded = false;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        if (raw.trim()) {
          this.data = { ...this.data, ...JSON.parse(raw) };
        }
      } else {
        this.persist();
      }
      this.loaded = true;
    } catch (err) {
      console.error('Error loading db.json, initializing fresh store:', err.message);
      this.persist();
      this.loaded = true;
    }
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err.message);
    }
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  // Matching helper for MongoDB-like queries
  matchQuery(doc, query = {}) {
    for (const [key, val] of Object.entries(query)) {
      if (key === '$or' && Array.isArray(val)) {
        const matchedOr = val.some((subQ) => this.matchQuery(doc, subQ));
        if (!matchedOr) return false;
        continue;
      }
      if (key === '$and' && Array.isArray(val)) {
        const matchedAnd = val.every((subQ) => this.matchQuery(doc, subQ));
        if (!matchedAnd) return false;
        continue;
      }

      const docVal = doc[key];

      if (val !== null && typeof val === 'object' && !(val instanceof RegExp)) {
        if (val.$regex) {
          const flags = val.$options || '';
          const reg = new RegExp(val.$regex, flags);
          if (!reg.test(String(docVal || ''))) return false;
          continue;
        }
        if (val.$in && Array.isArray(val.$in)) {
          if (!val.$in.includes(docVal)) return false;
          continue;
        }
        if (val.$nin && Array.isArray(val.$nin)) {
          if (val.$nin.includes(docVal)) return false;
          continue;
        }
        if (val.$gte !== undefined && docVal < val.$gte) return false;
        if (val.$lte !== undefined && docVal > val.$lte) return false;
        if (val.$gt !== undefined && docVal <= val.$gt) return false;
        if (val.$lt !== undefined && docVal >= val.$lt) return false;
        if (val.$ne !== undefined && docVal === val.$ne) return false;
        if (val.$exists !== undefined) {
          const exists = docVal !== undefined;
          if (exists !== val.$exists) return false;
          continue;
        }
      } else if (val instanceof RegExp) {
        if (!val.test(String(docVal || ''))) return false;
      } else if (docVal !== val) {
        return false;
      }
    }
    return true;
  }

  find(collectionName, query = {}, options = {}) {
    const col = this.getCollection(collectionName);
    let results = col.filter((doc) => this.matchQuery(doc, query));

    if (options.sort) {
      const [field, direction] = Object.entries(options.sort)[0] || [];
      if (field) {
        const factor = direction === -1 || direction === 'desc' ? -1 : 1;
        results.sort((a, b) => {
          if (a[field] < b[field]) return -1 * factor;
          if (a[field] > b[field]) return 1 * factor;
          return 0;
        });
      }
    }

    if (options.skip) {
      results = results.slice(options.skip);
    }

    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }

    // Return deep cloned copies
    return JSON.parse(JSON.stringify(results));
  }

  findOne(collectionName, query = {}) {
    const col = this.getCollection(collectionName);
    const item = col.find((doc) => this.matchQuery(doc, query));
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  findById(collectionName, id) {
    return this.findOne(collectionName, { _id: String(id) });
  }

  create(collectionName, doc) {
    const col = this.getCollection(collectionName);
    const newDoc = {
      _id: doc._id ? String(doc._id) : uuidv4(),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    col.push(newDoc);
    this.persist();
    return JSON.parse(JSON.stringify(newDoc));
  }

  createMany(collectionName, docs) {
    return docs.map((d) => this.create(collectionName, d));
  }

  updateOne(collectionName, query, updateData) {
    const col = this.getCollection(collectionName);
    const index = col.findIndex((doc) => this.matchQuery(doc, query));
    if (index === -1) return null;

    let updated = { ...col[index] };
    if (updateData.$set) {
      updated = { ...updated, ...updateData.$set };
    } else {
      updated = { ...updated, ...updateData };
    }

    if (updateData.$push) {
      for (const [key, val] of Object.entries(updateData.$push)) {
        if (!Array.isArray(updated[key])) updated[key] = [];
        updated[key].push(val);
      }
    }

    if (updateData.$inc) {
      for (const [key, val] of Object.entries(updateData.$inc)) {
        updated[key] = (Number(updated[key]) || 0) + Number(val);
      }
    }

    updated.updatedAt = new Date().toISOString();
    col[index] = updated;
    this.persist();
    return JSON.parse(JSON.stringify(updated));
  }

  findByIdAndUpdate(collectionName, id, updateData) {
    return this.updateOne(collectionName, { _id: String(id) }, updateData);
  }

  deleteOne(collectionName, query) {
    const col = this.getCollection(collectionName);
    const index = col.findIndex((doc) => this.matchQuery(doc, query));
    if (index === -1) return false;
    col.splice(index, 1);
    this.persist();
    return true;
  }

  findByIdAndDelete(collectionName, id) {
    return this.deleteOne(collectionName, { _id: String(id) });
  }

  countDocuments(collectionName, query = {}) {
    const col = this.getCollection(collectionName);
    return col.filter((doc) => this.matchQuery(doc, query)).length;
  }

  clearCollection(collectionName) {
    this.data[collectionName] = [];
    this.persist();
  }
}

export const db = new UniversalDB();
export default db;
