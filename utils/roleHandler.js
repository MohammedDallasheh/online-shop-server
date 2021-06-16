// roles is object keys than define the types and value define the return

const roleHandler = (resource, sub) => (type) => {
  if (!rolesByResource[resource] || !rolesByResource[resource]?.[sub])
    return rolesByResource.default;

  if (!rolesByResource[resource]?.[sub]?.[type])
    return (
      rolesByResource[resource][sub]['default'] ||
      rolesByResource.default
    );

  return rolesByResource[resource][sub][type];
};

const rolesByResource = {
  //--------------------------product--------------------------
  product: {
    get: {
      admin: { permissions: ['admin'] },
      self: { self: 'user' },
      public: {},
      autoComplate: { select: 'title' },
      default: { permissions: [], self: 'user' },
    },
    update: {
      admin: { permissions: ['admin'] },
      default: { permissions: ['admin', 'seller'], self: 'user' },
    },
    delete: {
      admin: { permissions: ['admin'] },
      default: { permissions: ['admin', 'seller'], self: 'user' },
    },
    create: {
      default: { permissions: ['admin', 'seller'], self: 'user' },
    },
  },
  //--------------------------category--------------------------
  category: {
    get: {
      default: { select: '-updatedAt -createdAt' },
      autoComplate: { select: 'title name' },
    },
  },
  //--------------------------sub--------------------------
  sub: {
    get: {
      default: { select: '-updatedAt -createdAt' },
      autoComplate: { select: 'title name' },
    },
  },
  //--------------------------user--------------------------
  user: {
    get: {
      admin: {
        permissions: ['admin', 'seller'],
        select: '-password',
      },
      seller: {
        permissions: ['admin', 'seller'],
        select:
          '_id role name email phone address imgs, avatar description',
      },
      autoComplate: { select: 'name email role' },
      self: { self: '_id', select: '-password' },
      default: {
        select: '_id name email imgs cart address avatar description',
      },
    },
    update: {
      admin: {
        permissions: ['admin'],
        allowed:
          'phone address name description isLock isActive role imgs avatar messages',
      },
      self: {
        self: '_id',
        allowed: 'phone address name description',
      },
      default: { self: '_id' },
    },
    delete: {
      admin: { permissions: ['admin'] },
      default: { self: 'user' },
    },
    create: {
      default: { permissions: [] },
    },
  },
  //--------------------------order--------------------------
  order: {
    get: {
      admin: { permissions: ['admin'] },
      seller: {
        // select: 'buyerId products',
        permissions: ['admin', 'seller'],
        self: 'sellerId',
      },
      default: { self: 'buyerId' },
    },
    update: {
      admin: { permissions: ['admin'] },
      default: { permissions: ['admin', 'seller'], self: 'sellerId' },
    },
    delete: {
      default: { permissions: ['admin'] },
    },
    create: {
      seller: { permissions: ['admin', 'seller'], self: 'sellerId' },
      default: { self: 'buyerId' },
    },
  },
  default: { permissions: ['admin'] },
};
module.exports = { roleHandler };
