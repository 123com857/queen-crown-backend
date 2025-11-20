import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Product, CartItem, Order, OrderStatus } from './types';
import { api } from './services/api';

// --- Helpers ---
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return '待付款';
    case 'paid': return '已付款';
    case 'shipped': return '已发货';
    case 'completed': return '已完成';
    default: return status;
  }
};

// --- Components ---

const Header = ({ cartCount }: { cartCount: number }) => (
  <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-serif font-bold">C</div>
        <span className="text-xl font-serif tracking-wide text-dark font-bold">Crown & Vow</span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-stone-600 hover:text-primary transition">首页</Link>
        <Link to="/cart" className="relative group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600 group-hover:text-primary transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-stone-900 text-stone-400 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-white font-serif text-lg mb-4">Crown & Vow</h3>
        <p className="text-sm leading-relaxed">为您的特殊时刻提供精致的新娘头饰和配饰。我们用心甄选每一件皇冠，只为让您在最重要的日子里闪耀动人。</p>
      </div>
      <div>
        <h3 className="text-white font-serif text-lg mb-4">客户服务</h3>
        <ul className="space-y-2 text-sm">
          <li>发货政策</li>
          <li>退换货说明</li>
          <li>联系我们</li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-serif text-lg mb-4">支付方式</h3>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-stone-800 rounded text-xs">支付宝</span>
          <span className="px-2 py-1 bg-stone-800 rounded text-xs">微信支付</span>
          <span className="px-2 py-1 bg-stone-800 rounded text-xs">银行转账</span>
        </div>
      </div>
    </div>
    <div className="text-center text-xs mt-12 pt-8 border-t border-stone-800">
      © 2024 Crown & Vow. 版权所有.
    </div>
  </footer>
);

const ProductCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="group block mb-6 break-inside-avoid">
    <div className="relative overflow-hidden rounded-lg bg-gray-100">
      <img 
        src={product.images[0] || `https://picsum.photos/400/500?random=${product.id}`} 
        alt={product.title} 
        className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-300" />
    </div>
    <div className="mt-3">
      <h3 className="text-sm font-medium text-stone-900 group-hover:text-primary transition">{product.title}</h3>
      <p className="text-sm text-stone-500 mt-1 font-serif">¥{product.price.toFixed(2)}</p>
    </div>
  </Link>
);

// --- Pages ---

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden bg-stone-900 flex items-center justify-center text-center px-4">
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight">每位女王的优雅时刻</h1>
          <p className="text-stone-200 text-lg mb-8">探索我们要的手工冠冕、皇冠和新娘配饰系列。</p>
          <a href="#collection" className="inline-block bg-primary hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-medium transition">
            浏览系列
          </a>
        </div>
      </div>

      {/* Collection */}
      <div id="collection" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-serif text-center mb-12 text-stone-800">最新上架</h2>
        {loading ? (
          <div className="text-center py-20 text-stone-400">正在加载精美商品...</div>
        ) : (
          <div className="columns-2 md:columns-4 gap-6 space-y-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = ({ addToCart }: { addToCart: (p: Product) => void }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getProduct(parseInt(id)).then(data => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !product) return <div className="pt-32 text-center">加载中...</div>;

  // Fallback image if array is empty or parsing failed
  const images = product.images && product.images.length > 0 ? product.images : [`https://picsum.photos/500/600?random=${product.id}`];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
            <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-serif text-stone-900 mb-4">{product.title}</h1>
          <p className="text-2xl text-primary font-medium mb-8">¥{product.price.toFixed(2)}</p>
          
          <div className="prose prose-stone mb-8">
            <p>精心手工制作。完美适合婚礼、派对或为您的日常生活增添皇家气息。材质：优质合金、水钻、仿珍珠。</p>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 text-sm text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                现货 - 极速发货
             </div>
             <button 
              onClick={() => addToCart(product)}
              className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white px-12 py-4 rounded-full font-medium transition flex items-center justify-center gap-2"
            >
              <span>加入购物车</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = ({ cart, removeFromCart, clearCart }: { cart: CartItem[], removeFromCart: (id: number) => void, clearCart: () => void }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [orderPlaced, setOrderPlaced] = useState<{id: number, paymentInfo: any} | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    
    try {
      const result = await api.createOrder({
        ...formData,
        items: cart.map(c => ({ id: c.id, quantity: c.quantity })),
        total_amount: total
      });
      setOrderPlaced({ id: result.orderId, paymentInfo: result.paymentInfo });
      clearCart();
    } catch (error) {
      alert("订单创建失败，请重试。");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">下单成功！</h2>
        <p className="text-stone-500 mb-8">订单号 #{orderPlaced.id}</p>
        
        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-lg mb-8">
          <h3 className="font-bold text-lg mb-4">请付款</h3>
          <p className="text-sm text-stone-600 mb-6">请扫描下方二维码或转账至银行账户以完成订单。</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 aspect-square flex items-center justify-center text-xs text-gray-400 rounded flex-col gap-2">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                [微信支付]
            </div>
            <div className="bg-gray-100 aspect-square flex items-center justify-center text-xs text-gray-400 rounded flex-col gap-2">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                [支付宝]
            </div>
          </div>

          <div className="text-left text-sm bg-stone-50 p-4 rounded border border-stone-100">
            <p className="font-bold mb-2">银行转账信息:</p>
            <p>开户行: 招商银行 (Merchant Bank)</p>
            <p>账号: 1234-5678-9012</p>
            <p>户名: CROWN SHOP</p>
            <p className="mt-2 text-red-500 text-xs">* 请在转账备注中填写您的订单号 #{orderPlaced.id}。</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">返回首页</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-stone-300 mb-4">购物车是空的</h2>
        <Link to="/" className="text-primary hover:underline">去购物</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <h2 className="text-xl font-serif font-bold mb-6">订单摘要</h2>
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 border-b border-stone-100">
               <img src={item.images[0]} className="w-20 h-20 object-cover rounded bg-gray-100" alt=""/>
               <div className="flex-1">
                 <h3 className="font-medium">{item.title}</h3>
                 <p className="text-stone-500 text-sm">数量: {item.quantity}</p>
                 <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 mt-2 hover:underline">移除</button>
               </div>
               <div className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between text-xl font-bold pt-4">
            <span>总计</span>
            <span>¥{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm h-fit sticky top-24">
        <h2 className="text-xl font-serif font-bold mb-6">收货信息</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">收货人姓名</label>
            <input 
              required
              type="text" 
              className="w-full border border-stone-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">联系电话</label>
            <input 
              required
              type="tel" 
              className="w-full border border-stone-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">详细地址</label>
            <textarea 
              required
              rows={3}
              className="w-full border border-stone-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>
          <button 
            disabled={submitting}
            type="submit" 
            className="w-full bg-stone-900 text-white py-4 rounded-md font-medium hover:bg-stone-800 transition disabled:opacity-50"
          >
            {submitting ? '提交中...' : '提交订单'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await api.adminLogin(password);
    if (user) {
      setToken(user.token);
      localStorage.setItem('admin_token', user.token);
    } else {
      alert('密码错误');
    }
  };

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getOrders(token);
      setOrders(data);
    } catch (e) {
      setToken(null); // Logout on error
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    if(!token) return;
    await api.updateOrder(id, status, token);
    fetchOrders();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('地址已复制！');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-xl font-bold mb-4 text-center">后台管理登录</h2>
          <input 
            type="password" 
            placeholder="请输入管理员密码" 
            className="w-full border p-2 rounded mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="w-full bg-primary text-white py-2 rounded hover:bg-yellow-600 transition">登录</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-2xl font-bold">订单管理系统</h1>
           <button onClick={() => {setToken(null); localStorage.removeItem('admin_token')}} className="text-red-600 text-sm hover:underline">退出登录</button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
              <tr>
                <th className="p-4">订单号</th>
                <th className="p-4">客户信息</th>
                <th className="p-4">总额</th>
                <th className="p-4">收货地址</th>
                <th className="p-4">状态</th>
                <th className="p-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="p-4 font-mono">#{order.id}</td>
                  <td className="p-4">
                    <div className="font-bold">{order.customer_name}</div>
                    <div className="text-stone-400 text-xs">{order.phone}</div>
                  </td>
                  <td className="p-4">¥{order.total_amount}</td>
                  <td className="p-4 max-w-xs truncate" title={order.address}>
                    {order.address}
                    <button onClick={() => copyToClipboard(`${order.customer_name} ${order.phone} ${order.address}`)} className="ml-2 text-blue-500 text-xs hover:text-blue-700">[复制]</button>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                     {order.status === 'pending' && (
                       <button onClick={() => updateStatus(order.id, 'paid')} className="text-green-600 hover:underline">标记已付</button>
                     )}
                     {order.status === 'paid' && (
                       <button onClick={() => updateStatus(order.id, 'shipped')} className="text-blue-600 hover:underline">发货</button>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Wrapper ---

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Header cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />} />
        </Routes>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={() => setCart([])} />} />
        </Routes>

        <Routes>
          <Route path="/admin" element={<></>} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </HashRouter>
  );
}