import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const { statuses } = useAuth();

  return (
    <div className="landing-root" style={{ 
      color: '#fff', 
      background: 'transparent',
      minHeight: '100vh'
    }}>
      {/* Dynamic Keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .hero-bg {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 8%',
        overflow: 'hidden'
      }}>
        {/* Animated Hero Background */}
        <div className="hero-bg" style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 0,
          background: `linear-gradient(to right, rgba(15, 23, 42, 1) 20%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.8) 100%), url('/gourmet_hero_bg_1773145858270.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)'
        }}></div>

        {/* Floating Decorative Items */}
        <div className="animate-float" style={{ position: 'absolute', top: '15%', right: '15%', width: '300px', height: '300px', zIndex: 1, opacity: 0.8 }}>
           <img src="https://i.postimg.cc/zvZCmGYb/gourmet_burger_hero_1773147069426.png" alt="Burger" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '30px', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }} />
        </div>
        <div className="animate-float delay-2" style={{ position: 'absolute', bottom: '15%', right: '25%', width: '220px', height: '220px', zIndex: 1, opacity: 0.7 }}>
           <img src="https://i.postimg.cc/7h3gqrqf/premium_sushi_set_1773147115835.png" alt="Sushi" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '30px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <div className="badge fade-in" style={{ marginBottom: '25px', letterSpacing: '3px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
             MICROSHELF-GRADE CULINARY
          </div>
          <h1 className="fade-in delay-1" style={{ fontSize: '5.5rem', fontWeight: 900, margin: '0 0 25px 0', lineHeight: 0.85, letterSpacing: '-5px' }}>
            A Move Towards <br />
            <span style={{ 
              background: 'linear-gradient(to right, var(--accent-gold) 0%, #fff 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic'
            }}>Digital Gastronomy</span>
          </h1>
          <p className="fade-in delay-2" style={{ color: 'var(--text-dim)', fontSize: '1.4rem', maxWidth: '600px', marginBottom: '45px', fontWeight: 300, lineHeight: 1.5 }}>
            Unlock the future of taste. Gourmet.Express delivers curated dining experiences powered by a zero-latency microservice core.
          </p>
          <div className="fade-in delay-2" style={{ display: 'flex', gap: '20px' }}>
            <Link to="/menu" className="btn-gold" style={{ padding: '18px 50px', fontSize: '1.2rem', boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)' }}>Launch Palette</Link>
            <Link to="/register" style={{ 
              padding: '18px 50px', borderRadius: '100px', background: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--glass-border)', color: '#fff', textDecoration: 'none', 
              fontWeight: 700, fontSize: '1.1rem', transition: '0.3s', backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >Identity Check</Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Strip */}
      <section style={{ padding: '80px 8%', background: '#0a101f' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {[
            { tag: 'BURGER', img: 'https://i.postimg.cc/zvZCmGYb/gourmet_burger_hero_1773147069426.png', label: 'Artisan Buns' },
            { tag: 'SUSHI', img: 'https://i.postimg.cc/7h3gqrqf/premium_sushi_set_1773147115835.png', label: 'Edo-Style' },
            { tag: 'STEAK', img: 'https://i.postimg.cc/5yBwfWfX/prime_steak_hero_1773147661998.png', label: 'Prime Cuts' },
            { tag: 'VEGAN', img: 'https://i.postimg.cc/yxmF7C7J/pure_plant_vegan_bowl_1773147689203.png', label: 'Pure Plant' },
          ].map((cat, i) => (
            <div key={i} className="glass-panel" style={{ 
              width: '240px', padding: '20px', textAlign: 'center', 
              transition: '0.4s', cursor: 'pointer', overflow: 'hidden'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-15px)'; e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
               <div style={{ height: '140px', borderRadius: '20px', overflow: 'hidden', marginBottom: '15px' }}>
                  <img src={cat.img} alt={cat.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '5px' }}>{cat.tag}</div>
               <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Gourmet Experience Section */}
      <section style={{ padding: '120px 8%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <span className="badge" style={{ marginBottom: '20px' }}>SYSTEM CAPABILITIES</span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 40px 0', letterSpacing: '-2px' }}>
              Why Choose <span style={{ color: 'var(--accent-gold)' }}>Gourmet.Express</span>?
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
               {[
                 { icon: '👨‍🍳', title: 'Curated by Architects', desc: 'Every dish is selected for balance, origin, and culinary impact.' },
                 { icon: '🚀', title: 'Zero-Latency Delivery', desc: 'Predictive logistics ensure your node is reached in under 30 minutes.' },
                 { icon: '🛡️', title: 'Identity Protection', desc: 'Your dietary data and location shards are fully encrypted end-to-end.' }
               ].map((feat, i) => (
                 <div key={i} style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{feat.icon}</div>
                    <div>
                       <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: 700 }}>{feat.title}</h4>
                       <p style={{ margin: 0, color: 'var(--text-dim)', lineHeight: 1.6 }}>{feat.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--accent-gold)', filter: 'blur(80px)', opacity: 0.1 }}></div>
             <h3 style={{ margin: '0 0 25px 0', fontSize: '1.4rem' }}>Infrastructure Status</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <StatusRow label="Identity Gateway" status={statuses.identity} />
                <StatusRow label="Catalog Ledger" status={statuses.catalog} />
                <StatusRow label="Order Pipeline" status={statuses.orders} />
                <StatusRow label="Payment Cluster" status={statuses.payment || 'pending'} />
             </div>
             <div style={{ marginTop: '30px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                LOCAL TIME: {new Date().toLocaleTimeString()}
             </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ padding: '100px 8%', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--accent-gold)', filter: 'blur(200px)', opacity: 0.05, borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-3px' }}>Ready to <span style={{ color: 'var(--accent-gold)' }}>Initiate</span>?</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 45px auto' }}>Join thousands of culinary enthusiasts already synchronized with our gourmet network.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/register" className="btn-gold" style={{ padding: '20px 60px', fontSize: '1.3rem' }}>Create Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatusRow = ({ label, status }: { label: string; status: string }) => {
  const active = status === 'live';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
       <span style={{ fontSize: '0.85rem' }}>{label}</span>
       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: active ? '#4ade80' : '#fbbf24', letterSpacing: '1px' }}>{status.toUpperCase()}</span>
          <div className={`status-dot ${status}`} style={{ width: '8px', height: '8px', boxShadow: active ? '0 0 10px #4ade80' : 'none' }}></div>
       </div>
    </div>
  );
};

export default Landing;

