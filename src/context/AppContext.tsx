import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Product,
  Category,
  HeroBanner,
  CartItem,
  Order,
  OrderStatus,
  Inquiry,
  EditorInvite,
  EditorRequest,
  AuditLogEntry,
  SiteSettings,
  CurrencyCode,
  ShippingAddress,
} from '../types';
import {
  CURRENCIES,
  INITIAL_SUPERUSER,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_INQUIRIES,
  INITIAL_INVITES,
  INITIAL_EDITOR_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
} from '../data/mockData';

export const MAX_ACTIVE_EDITORS = 20;

interface AppContextType {
  // Theme & Currency
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  calculateAppliedPrice: (product: Product, quantity: number) => number;

  // Navigation & Views
  currentView: 'storefront' | 'product_detail' | 'admin';
  setCurrentView: (view: 'storefront' | 'product_detail' | 'admin') => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isRfqModalOpen: boolean;
  setIsRfqModalOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isContactSellerOpen: boolean;
  setIsContactSellerOpen: (open: boolean) => void;
  contactSellerProduct: Product | null;
  setContactSellerProduct: (p: Product | null) => void;

  // User & Auth
  currentUser: UserProfile;
  users: UserProfile[];
  switchUserRole: (role: UserRole, customEmail?: string) => void;
  activeEditorsCount: number;

  // Editor Invite Flow
  invites: EditorInvite[];
  editorRequests: EditorRequest[];
  inviteEditor: (email: string) => { success: boolean; message: string; invite?: EditorInvite };
  acceptInvite: (token: string, name: string) => { success: boolean; message: string };
  requestEditorAccess: (data: { email: string; fullName: string; companyName: string; reason: string }) => { success: boolean; message: string };
  reviewEditorRequest: (requestId: string, approve: boolean) => { success: boolean; message: string };
  updateEditorStatus: (userId: string, newStatus: 'active' | 'suspended') => { success: boolean; message: string };
  revokeEditor: (userId: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'reviewsCount' | 'averageRating'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkImportProducts: (csvContent: string) => { imported: number; errors: string[] };

  // Categories & Banners
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  banners: HeroBanner[];
  addBanner: (banner: Omit<HeroBanner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<HeroBanner>) => void;
  deleteBanner: (id: string) => void;

  // Cart & Orders
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  favorites: string[];
  toggleFavorite: (productId: string) => void;

  orders: Order[];
  placeOrder: (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'pay_on_delivery' | 'mobile_money' | 'card_escrow' | 'wire_transfer';
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Inquiries & RFQs
  inquiries: Inquiry[];
  submitInquiry: (data: {
    productId?: string;
    productTitle?: string;
    productImage?: string;
    customerEmail: string;
    customerName: string;
    companyName?: string;
    targetQuantity?: number;
    targetPrice?: number;
    message: string;
  }) => void;
  replyInquiry: (inquiryId: string, replyMessage: string) => void;

  // Audit Log & Settings
  auditLogs: AuditLogEntry[];
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'amapati_store_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('amapati_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('amapati_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('amapati_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Currency
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Navigation
  const [currentView, setCurrentView] = useState<'storefront' | 'product_detail' | 'admin'>('storefront');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isContactSellerOpen, setIsContactSellerOpen] = useState(false);
  const [contactSellerProduct, setContactSellerProduct] = useState<Product | null>(null);

  // Core persistent state
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current logged in user (defaults to Superuser stopollos@gmail.com for ease of verification)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    return saved ? JSON.parse(saved) : INITIAL_SUPERUSER;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [banners, setBanners] = useState<HeroBanner[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_banners`);
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inquiries`);
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [invites, setInvites] = useState<EditorInvite[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_invites`);
    return saved ? JSON.parse(saved) : INITIAL_INVITES;
  });

  const [editorRequests, setEditorRequests] = useState<EditorRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_editor_requests`);
    return saved ? JSON.parse(saved) : INITIAL_EDITOR_REQUESTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_audit_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_favorites`);
    return saved ? JSON.parse(saved) : ['prod_01', 'prod_02'];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(banners));
  }, [banners]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inquiries`, JSON.stringify(inquiries));
  }, [inquiries]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_invites`, JSON.stringify(invites));
  }, [invites]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_editor_requests`, JSON.stringify(editorRequests));
  }, [editorRequests]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_favorites`, JSON.stringify(favorites));
  }, [favorites]);

  // Logging helper
  const addAuditLog = (action: string, target: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action,
      target,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Web App)',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Active editors calculation
  const activeEditorsCount = users.filter((u) => u.role === 'editor' && u.status === 'active').length;

  // Currency helper
  const formatPrice = (amountInUSD: number): string => {
    const config = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = amountInUSD * config.rate;
    if (currency === 'KES' || currency === 'NGN') {
      return `${config.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate applied price based on tier
  const calculateAppliedPrice = (product: Product, quantity: number): number => {
    if (!product.priceTiers || product.priceTiers.length === 0) {
      return product.basePrice;
    }
    // Find matching tier
    const matchedTier = product.priceTiers.find((tier) => {
      if (tier.maxQty === null) {
        return quantity >= tier.minQty;
      }
      return quantity >= tier.minQty && quantity <= tier.maxQty;
    });

    if (matchedTier) {
      return matchedTier.unitPrice;
    }
    // Fallback: If quantity exceeds highest defined tier, use highest tier
    const highestTier = [...product.priceTiers].sort((a, b) => b.minQty - a.minQty)[0];
    if (highestTier && quantity >= highestTier.minQty) {
      return highestTier.unitPrice;
    }
    return product.basePrice;
  };

  // Switch role helper
  const switchUserRole = (role: UserRole, customEmail?: string) => {
    if (role === 'superuser') {
      const superuser = users.find((u) => u.role === 'superuser') || INITIAL_SUPERUSER;
      setCurrentUser(superuser);
      return;
    }
    if (role === 'editor') {
      const editor = users.find((u) => u.role === 'editor' && u.status === 'active') || users.find((u) => u.role === 'editor');
      if (editor) {
        setCurrentUser(editor);
      } else {
        const fallbackEditor: UserProfile = {
          id: `usr_editor_${Date.now()}`,
          email: customEmail || 'sarah.editor@amapati.com',
          name: 'Sarah Chen (Editor)',
          role: 'editor',
          status: 'active',
          companyName: 'Amapati Hardware Desk',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, fallbackEditor]);
        setCurrentUser(fallbackEditor);
      }
      return;
    }
    // Customer
    const customer = users.find((u) => u.role === 'customer') || {
      id: `usr_cust_${Date.now()}`,
      email: customEmail || 'alex.buyer@techcorp.com',
      name: 'Alex Rivera (Customer)',
      role: 'customer',
      status: 'active',
      companyName: 'Rivera Systems Ltd',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(customer);
  };

  // Open product detail
  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Editor Invite Flow
  const inviteEditor = (email: string) => {
    // Check 20 active editors limit
    if (activeEditorsCount >= MAX_ACTIVE_EDITORS) {
      return {
        success: false,
        message: `Maximum limit of ${MAX_ACTIVE_EDITORS} active editors reached. Revoke or suspend an existing editor before inviting a new one.`,
      };
    }

    // Check if already invited or already an active editor
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser && existingUser.role === 'editor' && existingUser.status === 'active') {
      return { success: false, message: `A user with email ${email} is already an active editor.` };
    }

    const token = `amp_inv_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const newInvite: EditorInvite = {
      id: `inv_${Date.now()}`,
      email: email.trim().toLowerCase(),
      token,
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      used: false,
      invitedBy: currentUser.email,
      createdAt: new Date().toISOString(),
    };

    setInvites((prev) => [newInvite, ...prev]);

    // Also register in users list if not present, marked as 'invited'
    if (!existingUser) {
      const invitedUserProfile: UserProfile = {
        id: `usr_inv_${Date.now()}`,
        email: email.trim().toLowerCase(),
        name: email.split('@')[0],
        role: 'editor',
        status: 'invited',
        createdAt: new Date().toISOString(),
        lastLogin: 'Never',
      };
      setUsers((prev) => [...prev, invitedUserProfile]);
    }

    addAuditLog('EDITOR_INVITE_CREATED', email, `Generated 48hr single-use invite token. Active editors: ${activeEditorsCount}/${MAX_ACTIVE_EDITORS}.`);

    return {
      success: true,
      message: `Single-use invite link created for ${email}. Expires in 48 hours.`,
      invite: newInvite,
    };
  };

  const acceptInvite = (token: string, name: string) => {
    const invite = invites.find((inv) => inv.token === token && !inv.used);
    if (!invite) {
      return { success: false, message: 'Invalid or already used invite token.' };
    }

    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'This invite link has expired (48-hour limit).' };
    }

    if (activeEditorsCount >= MAX_ACTIVE_EDITORS) {
      return { success: false, message: `Cannot activate: Platform has reached maximum of ${MAX_ACTIVE_EDITORS} active editors.` };
    }

    // Mark invite used
    setInvites((prev) => prev.map((inv) => (inv.id === invite.id ? { ...inv, used: true } : inv)));

    // Activate user
    let updatedEditor: UserProfile;
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.email.toLowerCase() === invite.email.toLowerCase());
      if (idx >= 0) {
        const u = prev[idx];
        const updated = {
          ...u,
          name: name || u.name,
          role: 'editor' as UserRole,
          status: 'active' as const,
          lastLogin: new Date().toISOString(),
        };
        updatedEditor = updated;
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      } else {
        const created: UserProfile = {
          id: `usr_ed_${Date.now()}`,
          email: invite.email,
          name: name || invite.email.split('@')[0],
          role: 'editor',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        updatedEditor = created;
        return [...prev, created];
      }
    });

    addAuditLog('EDITOR_INVITE_ACCEPTED', invite.email, `Editor role activated via invite link.`);

    // Switch current user to this newly activated editor
    setCurrentUser({
      id: `usr_${Date.now()}`,
      email: invite.email,
      name: name || invite.email.split('@')[0],
      role: 'editor',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    return { success: true, message: `Welcome to Amapati Editor Team, ${name}!` };
  };

  const requestEditorAccess = (data: { email: string; fullName: string; companyName: string; reason: string }) => {
    const newReq: EditorRequest = {
      id: `req_${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
      companyName: data.companyName.trim(),
      reason: data.reason.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setEditorRequests((prev) => [newReq, ...prev]);
    addAuditLog('EDITOR_REQUEST_SUBMITTED', data.email, `Application from ${data.fullName} (${data.companyName}) submitted for Superuser approval.`);
    return { success: true, message: 'Your editor request has been submitted to the Superuser for review.' };
  };

  const reviewEditorRequest = (requestId: string, approve: boolean) => {
    const req = editorRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found.' };

    if (approve) {
      if (activeEditorsCount >= MAX_ACTIVE_EDITORS) {
        return { success: false, message: `Cannot approve: Maximum ${MAX_ACTIVE_EDITORS} active editors reached.` };
      }
      const inviteResult = inviteEditor(req.email);
      setEditorRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r)));
      addAuditLog('EDITOR_REQUEST_APPROVED', req.email, `Approved request from ${req.fullName}. Invite generated.`);
      return { success: true, message: `Request approved. ${inviteResult.message}` };
    } else {
      setEditorRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r)));
      addAuditLog('EDITOR_REQUEST_REJECTED', req.email, `Rejected editor application for ${req.fullName}.`);
      return { success: true, message: `Request rejected.` };
    }
  };

  const updateEditorStatus = (userId: string, newStatus: 'active' | 'suspended') => {
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'User not found.' };

    if (newStatus === 'active' && user.status !== 'active') {
      if (activeEditorsCount >= MAX_ACTIVE_EDITORS) {
        return { success: false, message: `Cannot activate: Platform currently at capacity (${MAX_ACTIVE_EDITORS} active editors).` };
      }
    }

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    addAuditLog('EDITOR_STATUS_UPDATED', user.email, `Editor status changed to ${newStatus}.`);
    return { success: true, message: `Editor ${user.name} is now ${newStatus}.` };
  };

  const revokeEditor = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: 'customer' as UserRole, status: 'active' as const } : u)));
    addAuditLog('EDITOR_ROLE_REVOKED', user.email, `Role downgraded to customer.`);
  };

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'reviewsCount' | 'averageRating'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      reviews: [],
      reviewsCount: 0,
      averageRating: 5.0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    addAuditLog('PRODUCT_CREATED', newProduct.sku, `Product "${newProduct.title}" added to catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addAuditLog('PRODUCT_UPDATED', id, `Updated attributes on product.`);
  };

  const deleteProduct = (id: string) => {
    const p = products.find((prod) => prod.id === id);
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    addAuditLog('PRODUCT_DELETED', p?.sku || id, `Deleted product "${p?.title || id}".`);
  };

  const bulkImportProducts = (csvContent: string): { imported: number; errors: string[] } => {
    const lines = csvContent.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      return { imported: 0, errors: ['CSV file must have a header row and at least 1 data row.'] };
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const importedProducts: Product[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 5) {
        errors.push(`Row ${i + 1}: Insufficient columns.`);
        continue;
      }

      const title = cols[0] || `Bulk Item ${i}`;
      const sku = cols[1] || `BULK-${Date.now()}-${i}`;
      const price = parseFloat(cols[2]) || 100;
      const moq = parseInt(cols[3], 10) || 1;
      const stock = parseInt(cols[4], 10) || 50;
      const categoryName = cols[5] || 'Smart Phones & Tablets';
      const categoryId = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase())?.id || categories[0]?.id || 'cat_electronics';
      const imageUrl = cols[6] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

      const prod: Product = {
        id: `prod_bulk_${Date.now()}_${i}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId,
        categoryName,
        sku,
        shortDescription: `Wholesale ${title} with factory warranty and fast logistics.`,
        description: `High-quality industrial and consumer grade ${title}. Meets international trade compliance standards.`,
        images: [imageUrl],
        priceTiers: [
          { minQty: moq, maxQty: moq * 5, unitPrice: price },
          { minQty: moq * 5 + 1, maxQty: moq * 20, unitPrice: Math.round(price * 0.9) },
          { minQty: moq * 20 + 1, maxQty: null, unitPrice: Math.round(price * 0.8) },
        ],
        basePrice: price,
        moq,
        stock,
        leadTimeDays: 7,
        specs: [
          { name: 'Quality Grade', value: 'A+ Factory Spec' },
          { name: 'Warranty', value: '1 Year Manufacturer' },
        ],
        supplier: {
          name: 'Global Verified Tech Supplier Ltd.',
          country: 'China',
          countryCode: 'CN',
          verified: true,
          tradeAssurance: true,
          yearsInBusiness: 6,
          rating: 4.8,
          responseRate: '98%',
        },
        featured: false,
        isNewArrival: true,
        isTopRated: false,
        reviewsCount: 0,
        averageRating: 5.0,
        reviews: [],
        createdAt: new Date().toISOString(),
      };
      importedProducts.push(prod);
    }

    if (importedProducts.length > 0) {
      setProducts((prev) => [...importedProducts, ...prev]);
      addAuditLog('BULK_CSV_IMPORT', `${importedProducts.length} items`, `Imported ${importedProducts.length} products via CSV bulk tool.`);
    }

    return { imported: importedProducts.length, errors };
  };

  // Categories & Banners
  const addCategory = (cat: Omit<Category, 'id' | 'productCount'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat_${Date.now()}`,
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    addAuditLog('CATEGORY_CREATED', newCat.name, `New category created.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addBanner = (banner: Omit<HeroBanner, 'id'>) => {
    const newBanner: HeroBanner = {
      ...banner,
      id: `ban_${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);
    addAuditLog('BANNER_CREATED', newBanner.title, `Hero carousel banner added.`);
  };

  const updateBanner = (id: string, updates: Partial<HeroBanner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = product.moq || 1) => {
    const validQty = Math.max(quantity, product.moq || 1);
    const unitPrice = calculateAppliedPrice(product, validQty);

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newTotalQty = existing.quantity + validQty;
        const recalculatedPrice = calculateAppliedPrice(product, newTotalQty);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newTotalQty, appliedUnitPrice: recalculatedPrice }
            : item
        );
      }
      return [...prev, { product, quantity: validQty, appliedUnitPrice: unitPrice }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            if (quantity <= 0) return null;
            const recalculatedPrice = calculateAppliedPrice(item.product, quantity);
            return { ...item, quantity, appliedUnitPrice: recalculatedPrice };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.appliedUnitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  // Orders
  const placeOrder = (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'pay_on_delivery' | 'mobile_money' | 'card_escrow' | 'wire_transfer';
    notes?: string;
  }): Order => {
    const subtotal = cartTotal;
    const shippingFee = subtotal > 1000 ? 0 : 45.0;
    const tax = subtotal * (settings.taxRatePercent / 100);
    const total = subtotal + shippingFee + tax;

    const orderNumber = `AMP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerEmail: currentUser.email,
      customerName: currentUser.name || orderData.shippingAddress.fullName,
      items: cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0] || '',
        quantity: item.quantity,
        unitPrice: item.appliedUnitPrice,
        totalPrice: item.appliedUnitPrice * item.quantity,
      })),
      subtotal,
      shippingFee,
      tax,
      total,
      currency: 'USD',
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'pay_on_delivery' ? 'pending' : 'escrow_held',
      shippingAddress: orderData.shippingAddress,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber: `TRK-AMP-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addAuditLog('ORDER_PLACED', orderNumber, `Customer ${currentUser.email} placed order for ${formatPrice(total)}.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            trackingNumber: trackingNumber || ord.trackingNumber,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    addAuditLog('ORDER_STATUS_UPDATED', orderId, `Status transitioned to ${status}.`);
  };

  // Inquiries & RFQs
  const submitInquiry = (data: {
    productId?: string;
    productTitle?: string;
    productImage?: string;
    customerEmail: string;
    customerName: string;
    companyName?: string;
    targetQuantity?: number;
    targetPrice?: number;
    message: string;
  }) => {
    const newInquiry: Inquiry = {
      ...data,
      id: `inq_${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    addAuditLog('INQUIRY_CREATED', data.productTitle || 'General RFQ', `Inquiry received from ${data.customerName} (${data.customerEmail}).`);
  };

  const replyInquiry = (inquiryId: string, replyMessage: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId
          ? {
              ...inq,
              status: 'replied',
              replyMessage,
              repliedAt: new Date().toISOString(),
              repliedBy: currentUser.email,
            }
          : inq
      )
    );
    addAuditLog('INQUIRY_REPLIED', inquiryId, `Reply sent by ${currentUser.email}.`);
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATED', 'Global Configuration', `Superuser updated marketplace settings.`);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currency,
        setCurrency,
        formatPrice,
        calculateAppliedPrice,

        currentView,
        setCurrentView,
        selectedProductId,
        openProductDetail,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeAdminTab,
        setActiveAdminTab,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isRfqModalOpen,
        setIsRfqModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isContactSellerOpen,
        setIsContactSellerOpen,
        contactSellerProduct,
        setContactSellerProduct,

        currentUser,
        users,
        switchUserRole,
        activeEditorsCount,

        invites,
        editorRequests,
        inviteEditor,
        acceptInvite,
        requestEditorAccess,
        reviewEditorRequest,
        updateEditorStatus,
        revokeEditor,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkImportProducts,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        favorites,
        toggleFavorite,

        orders,
        placeOrder,
        updateOrderStatus,

        inquiries,
        submitInquiry,
        replyInquiry,

        auditLogs,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
