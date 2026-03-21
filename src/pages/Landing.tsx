import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuItems } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Landing: React.FC = () => {
    const { statuses } = useAuth();
    const [featuredItems, setFeaturedItems] = useState<any[]>([]);

    useEffect(() => {
        getMenuItems().then(res => {
            if (res.data?.success && Array.isArray(res.data.data)) {
                const shuffled = [...res.data.data].sort(() => 0.5 - Math.random());
                // Duplicate for smooth infinite marquee scrolling
                setFeaturedItems([...shuffled.slice(0, 6), ...shuffled.slice(0, 6)]);
            }
        }).catch(err => console.error("Could not fetch elements", err));
    }, []);

    const heroContentRef = useRef<HTMLDivElement>(null);
    const burgerRef = useRef<HTMLDivElement>(null);
    const sushiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hero Animations
        const ctx = gsap.context(() => {
            gsap.from('.hero-content-inner > *', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            // Parallax for floating assets
            gsap.to(burgerRef.current, {
                y: -100,
                scrollTrigger: {
                    trigger: '.hero-root',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });

            gsap.to(sushiRef.current, {
                y: 60,
                scrollTrigger: {
                    trigger: '.hero-root',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2
                }
            });

            // Feature Section Reveal
            gsap.from('.feature-card', {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: '.features-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Image Reveal Parallax
            gsap.to('.hero-bg-overlay', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-root',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="landing-page-root">
            {/* 1. HERO SECTION */}
            <section className="hero-root">
                <div className="hero-bg-wrapper">
                    <div className="hero-bg-overlay"></div>
                    <div className="hero-gradient-shield"></div>
                </div>

                <div className="hero-floating-elements">
                    <div ref={burgerRef} className="parallax-item burger-parallax">
                        <img src="https://i.postimg.cc/zvZCmGYb/gourmet_burger_hero_1773147069426.png" alt="Burger" />
                    </div>
                    <div ref={sushiRef} className="parallax-item sushi-parallax">
                        <img src="https://i.postimg.cc/7h3gqrqf/premium_sushi_set_1773147115835.png" alt="Sushi" />
                    </div>
                </div>

                <div className="hero-content-container" ref={heroContentRef}>
                    <div className="hero-content-inner">
                        <div className="new-tag">
                            <span className="dot"></span>
                            V2.0 NOW REFINED
                        </div>
                        <h1 className="hero-headline">
                            Digital <span className="italic-gold">Gastronomy</span> <br /> 
                            at Scale.
                        </h1>
                        <p className="hero-description">
                            The definitive intersection of high-tier culinary arts and zero-latency microservice architecture. Synchronize your cravings with our gourmet core.
                        </p>
                        <div className="hero-actions">
                            <Link to="/menu" className="btn-gold-lg">Launch Repository</Link>
                            <Link to="/register" className="btn-glass-lg">Initialize Access</Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-num">30K+</span>
                                <span className="stat-label">Active Nodes</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-num">99.9%</span>
                                <span className="stat-label">Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                    <span>ORBIT SCAN</span>
                </div>
            </section>

            {/* 2. CATEGORIES HORIZONTAL */}
            <section className="categories-strip">
                <div className="strip-track">
                    {[
                        { label: 'BURGER', img: 'https://i.postimg.cc/zvZCmGYb/gourmet_burger_hero_1773147069426.png' },
                        { label: 'SUSHI', img: 'https://i.postimg.cc/7h3gqrqf/premium_sushi_set_1773147115835.png' },
                        { label: 'STEAK', img: 'https://i.postimg.cc/5yBwfWfX/prime_steak_hero_1773147661998.png' },
                        { label: 'VEGAN', img: 'https://i.postimg.cc/yxmF7C7J/pure_plant_vegan_bowl_1773147689203.png' },
                        { label: 'PASTA', img: 'https://i.postimg.cc/zvZCmGYb/gourmet_burger_hero_1773147069426.png' },
                    ].map((c, i) => (
                        <Link to="/menu" key={i} className="cat-pill">
                            <div className="pill-img"><img src={c.img} alt={c.label} /></div>
                            <span className="pill-label">{c.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. CAPABILITIES GRID */}
            <section className="capabilities-section">
                <div className="section-header-centered">
                    <div className="mini-badge">ECOSYSTEM</div>
                    <h2 className="section-title-lg">Engineered for <span className="text-gold">Perfection</span></h2>
                </div>

                <div className="features-grid">
                    <div className="glass-panel feature-card">
                        <div className="card-icon">👨‍🍳</div>
                        <h3>Architected Menus</h3>
                        <p>Our menus are not written; they are architected for nutritional density and maximum flavor profile impact.</p>
                    </div>
                    <div className="glass-panel feature-card">
                        <div className="card-icon">🚀</div>
                        <h3>Zero-Latency Logistics</h3>
                        <p>Proprietary predictive routing ensures your order leaves the kitchen before you even finish thinking about it.</p>
                    </div>
                    <div className="glass-panel feature-card">
                        <div className="card-icon">🛡️</div>
                        <h3>Secured Taste</h3>
                        <p>Your dietary preferences and history are sharded and encrypted, accessible only to authorized gourmet nodes.</p>
                    </div>
                </div>
            </section>

            {/* 4. PROCESS SECTION (GSAP PINNING TARGET) */}
            <section className="process-section">
                <div className="process-layout">
                    <div className="process-info">
                        <div className="mini-badge">WORKFLOW</div>
                        <h2 className="section-title-lg">How It <span className="text-gold">Works</span></h2>
                        <div className="steps-list">
                            <div className="step-item">
                                <div className="step-num">01</div>
                                <div className="step-text">
                                    <h4>Establish Connection</h4>
                                    <p>Authenticate your identity and initialize your dietary preferences in our global ledger.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <div className="step-num">02</div>
                                <div className="step-text">
                                    <h4>Select Repository</h4>
                                    <p>Browse through hundreds of curated items specialized for your current nutritional needs.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <div className="step-num">03</div>
                                <div className="step-text">
                                    <h4>Initiate Protocol</h4>
                                    <p>Our zero-latency pipeline triggers immediately, dispatching our high-speed courier units.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="process-visual">
                        <div className="glass-panel status-visual-card">
                            <div className="visual-header">Live Infrastructure</div>
                            <div className="status-bars">
                                <StatusRow label="Identity Gateway" status={statuses.identity} />
                                <StatusRow label="Catalog Ledger" status={statuses.catalog} />
                                <StatusRow label="Order Pipeline" status={statuses.orders} />
                                <StatusRow label="Payment Cluster" status={statuses.payment || 'pending'} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. LIVE MENU CAROUSEL */}
            <section className="featured-menu-section">
                <div className="marquee-container">
                    <div className="marquee-track">
                        {featuredItems.map((item, idx) => (
                            <Link to="/menu" key={`feat-${idx}`} style={{textDecoration: 'none'}} className="glass-panel marquee-card">
                                <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&h=300&fit=crop'} alt={item.name} className="marquee-img" />
                                <div className="marquee-info">
                                    <h4 style={{color: '#fff'}}>{item.name}</h4>
                                    <p className="text-gold">LKR {Number(item.price).toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. OPERATIVE FEEDBACK */}
            <section className="reviews-section">
                <div className="section-header-centered">
                    <div className="mini-badge">TELEMETRY</div>
                    <h2 className="section-title-lg">Node <span className="text-gold">Feedback</span></h2>
                </div>
                <div className="reviews-grid">
                    {[
                        { name: "Agent K.", role: "Lead Architect", quote: "The latency is zero and the flavor is absolute. I haven't cooked in months." },
                        { name: "Dr. Vance", role: "Nutrition Specialist", quote: "Perfectly optimized protein synthesis delivered through an encrypted pipeline." },
                        { name: "S. Reynolds", role: "Logistics", quote: "The UI matches the premium taste of the Wagyu. Flawless execution." }
                    ].map((review, idx) => (
                        <div key={idx} className="glass-panel review-card" style={{padding: '30px'}}>
                            <div style={{color: 'var(--accent-gold)', marginBottom: '15px'}} className="stars">★★★★★</div>
                            <p className="review-quote">"{review.quote}"</p>
                            <div className="review-author" style={{display: 'flex', flexDirection: 'column', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px'}}>
                                <strong style={{color: '#fff', fontWeight: 800}}>{review.name}</strong>
                                <span style={{fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase'}}>{review.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. CALL TO ACTION */}
            <section className="cta-final">
                <div className="cta-glow-bg"></div>
                <div className="cta-content-wrapper">
                    <h2>Ready to <span className="italic-gold">Synchronize?</span></h2>
                    <p>Join the thousands of operatives already receiving high-grade culinary support.</p>
                    <Link to="/register" className="btn-gold-cta">Synthesize Account</Link>
                </div>
            </section>

            {/* 7. FOOTER */}
            <footer className="landing-footer">
                <div className="footer-grid">
                    <div className="footer-brand-col">
                        <div className="footer-logo">G.E.</div>
                        <p>Redefining delivery through the lens of modern software engineering.</p>
                    </div>
                    <div className="footer-links">
                        <div className="link-group">
                            <h5>ECOSYSTEM</h5>
                            <Link to="/menu">Kitchen</Link>
                            <Link to="/about">About</Link>
                            <Link to="/admin/login">Admin Access</Link>
                        </div>
                        <div className="link-group">
                            <h5>LEGAL</h5>
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/terms">Terms</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 Gourmet.Express Architecture</span>
                    <div className="social-links">
                        <span>LNKD</span>
                        <span>INST</span>
                        <span>TWTR</span>
                    </div>
                </div>
            </footer>

            <style>{`
                .landing-page-root { width: 100%; overflow-x: hidden; background: #010409; }
                
                /* Hero */
                .hero-root { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 0 clamp(1rem, 8vw, 10vw); overflow: hidden; }
                .hero-bg-wrapper { position: absolute; inset: 0; z-index: 0; }
                .hero-bg-overlay { position: absolute; inset: 0; background: url('/gourmet_hero_bg_1773145858270.png'); background-size: cover; background-position: center; filter: brightness(0.6); }
                .hero-gradient-shield { position: absolute; inset: 0; background: radial-gradient(circle at 0% 0%, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.8) 40%, transparent 100%); }
                
                .hero-floating-elements { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
                .parallax-item { position: absolute; filter: drop-shadow(0 30px 60px rgba(0,0,0,0.6)); transition: transform 0.1s linear; }
                .burger-parallax { top: 15%; right: 12%; width: clamp(200px, 30vw, 400px); }
                .sushi-parallax { bottom: 10%; right: 25%; width: clamp(150px, 20vw, 300px); }
                .parallax-item img { width: 100%; border-radius: 40px; }

                .hero-content-container { position: relative; z-index: 2; width: 100%; max-width: 900px; display: flex; flex-direction: column; justify-content: center; }
                .hero-content-inner { display: flex; flex-direction: column; gap: 20px; }
                .new-tag { display: flex; align-items: center; gap: 8px; color: var(--accent-gold); font-size: 0.75rem; font-weight: 800; letter-spacing: 3px; background: rgba(251, 146, 60, 0.08); padding: 8px 16px; border-radius: 50px; border: 1px solid rgba(251, 146, 60, 0.2); width: fit-content; }
                .new-tag .dot { width: 6px; height: 6px; background: var(--accent-gold); border-radius: 50%; box-shadow: 0 0 10px var(--accent-gold); }
                .hero-headline { font-size: clamp(3rem, 10vw, 6rem); color: #fff; font-weight: 900; line-height: 0.9; margin: 0; letter-spacing: -4px; }
                .hero-headline .italic-gold { font-style: italic; background: linear-gradient(to bottom right, var(--accent-gold), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-description { color: var(--text-dim); font-size: clamp(1rem, 2vw, 1.4rem); line-height: 1.6; max-width: 600px; margin: 10px 0 30px; font-weight: 300; }
                .hero-actions { display: flex; gap: 20px; flex-wrap: wrap; }
                .btn-gold-lg { background: linear-gradient(135deg, var(--accent-gold), #ea580c); color: #000; padding: 22px 50px; border-radius: 100px; font-weight: 800; text-decoration: none; font-size: 1.1rem; box-shadow: 0 20px 40px rgba(234, 88, 12, 0.3); transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .btn-gold-lg:hover { transform: translateY(-5px); box-shadow: 0 30px 60px rgba(234, 88, 12, 0.4); }
                .btn-glass-lg { background: rgba(255,255,255,0.03); color: #fff; padding: 22px 50px; border-radius: 100px; font-weight: 700; text-decoration: none; font-size: 1.1rem; border: 1px solid var(--glass-border); transition: 0.3s; backdrop-filter: blur(10px); }
                .btn-glass-lg:hover { background: rgba(255,255,255,0.08); }
                
                .hero-stats { display: flex; gap: 40px; margin-top: 40px; }
                .stat-item { display: flex; flex-direction: column; }
                .stat-num { font-size: 1.8rem; font-weight: 800; color: #fff; }
                .stat-label { font-size: 0.7rem; color: var(--text-dim); letter-spacing: 2px; }
                .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

                /* Categories */
                .categories-strip { padding: 40px 0; background: #000; overflow: hidden; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); }
                .strip-track { display: flex; gap: 60px; padding: 0 8vw; align-items: center; width: max-content; }
                .cat-pill { display: flex; align-items: center; gap: 15px; text-decoration: none; color: #fff; opacity: 0.5; transition: 0.3s; }
                .cat-pill:hover { opacity: 1; transform: scale(1.05); }
                .pill-img { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; }
                .pill-img img { width: 100%; height: 100%; object-fit: cover; }
                .pill-label { font-size: 0.8rem; font-weight: 800; letter-spacing: 3px; }

                /* Capabilities */
                .capabilities-section { padding: 120px 8vw; max-width: 1400px; margin: 0 auto; }
                .section-header-centered { text-align: center; margin-bottom: 80px; }
                .mini-badge { display: inline-block; color: var(--accent-gold); font-size: 0.7rem; font-weight: 800; letter-spacing: 4px; margin-bottom: 20px; }
                .section-title-lg { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; margin: 0; letter-spacing: -2px; }
                .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
                .feature-card { transition: 0.4s; }
                .feature-card:hover { transform: translateY(-10px); border-color: var(--accent-gold); }
                .card-icon { font-size: 3rem; margin-bottom: 25px; }
                .feature-card h3 { font-size: 1.6rem; margin-bottom: 15px; }
                .feature-card p { color: var(--text-dim); line-height: 1.6; }

                /* Process Section */
                .process-section { padding: 120px 8vw; background: #0a1120; border-radius: 100px 100px 0 0; }
                .process-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; max-width: 1400px; margin: 0 auto; align-items: center; }
                .steps-list { display: flex; flex-direction: column; gap: 40px; margin-top: 50px; }
                .step-item { display: flex; gap: 30px; }
                .step-num { font-size: 3rem; font-weight: 900; color: rgba(251, 146, 60, 0.1); line-height: 1; }
                .step-text h4 { font-size: 1.4rem; margin: 0 0 10px 0; }
                .step-text p { color: var(--text-dim); line-height: 1.6; }
                .visual-header { font-size: 1rem; font-weight: 800; margin-bottom: 30px; text-align: center; color: var(--accent-gold); }
                .status-bars { display: flex; flex-direction: column; gap: 15px; }

                /* Dynamic Marquee */
                .featured-menu-section { padding: 40px 0 120px; overflow: hidden; width: 100vw; position: relative; margin-left: calc(-50vw + 50%); }
                .marquee-container { position: relative; width: 100%; display: flex; overflow: hidden; padding: 20px 0; }
                .marquee-container::before, .marquee-container::after { content: ''; position: absolute; top: 0; bottom: 0; width: 15vw; z-index: 2; pointer-events: none; }
                .marquee-container::before { left: 0; background: linear-gradient(to right, #010409, transparent); }
                .marquee-container::after { right: 0; background: linear-gradient(to left, #010409, transparent); }
                .marquee-track { display: flex; gap: 40px; width: max-content; animation: scroll-marquee 50s linear infinite; }
                .marquee-track:hover { animation-play-state: paused; }
                .marquee-card { width: 320px; flex-shrink: 0; padding: 15px !important; display: flex; align-items: center; gap: 20px; border-radius: 20px; background: rgba(255,255,255,0.02); transition: 0.3s; cursor: pointer; text-decoration: none; }
                .marquee-card:hover { transform: translateY(-5px); border-color: var(--accent-gold); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .marquee-img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }
                .marquee-info h4 { margin: 0 0 5px; font-size: 1.1rem; }
                .marquee-info p { margin: 0; font-weight: 800; font-size: 0.9rem; }
                @keyframes scroll-marquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 20px)); } }

                /* Reviews Section */
                .reviews-section { padding: 0 8vw 120px; max-width: 1400px; margin: 0 auto; }
                .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
                .review-card { transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                .review-card:hover { transform: translateY(-10px) rotate(1deg); box-shadow: 0 20px 40px rgba(0,0,0,0.5); border-color: rgba(251, 146, 60, 0.3); }
                .review-quote { font-size: 1.1rem; line-height: 1.6; color: var(--text-main); font-style: italic; font-weight: 300; }

                /* Final CTA */
                .cta-final { padding: 180px 8vw; text-align: center; position: relative; }
                .cta-glow-bg { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(251, 146, 60, 0.08) 0%, transparent 70%); }
                .cta-content-wrapper { position: relative; z-index: 1; }
                .cta-content-wrapper h2 { font-size: 5rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -4px; }
                .cta-content-wrapper p { font-size: 1.4rem; color: var(--text-dim); margin-bottom: 50px; }
                .btn-gold-cta { background: var(--accent-gold); color: #000; padding: 25px 80px; border-radius: 100px; font-weight: 900; text-decoration: none; font-size: 1.3rem; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .btn-gold-cta:hover { transform: scale(1.05); box-shadow: 0 40px 100px rgba(251, 146, 60, 0.3); }

                /* Footer */
                .landing-footer { padding: 100px 8vw 40px; background: #000; border-top: 1px solid var(--glass-border); }
                .footer-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 100px; margin-bottom: 80px; }
                .footer-brand-col .footer-logo { font-size: 2rem; font-weight: 900; color: var(--accent-gold); margin-bottom: 20px; }
                .footer-brand-col p { color: var(--text-dim); max-width: 300px; line-height: 1.6; }
                .footer-links { display: flex; gap: 100px; }
                .link-group h5 { font-size: 0.75rem; letter-spacing: 2px; color: #444; margin-bottom: 25px; }
                .link-group { display: flex; flex-direction: column; gap: 12px; }
                .link-group a { color: var(--text-dim); text-decoration: none; font-size: 0.9rem; transition: 0.3s; }
                .link-group a:hover { color: #fff; }
                .footer-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 40px; color: #333; font-size: 0.75rem; }
                .social-links { display: flex; gap: 20px; font-weight: 800; }

                /* Scroll Indicator */
                .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 0.6; z-index: 5; }
                .mouse { width: 22px; height: 36px; border: 1.5px solid #fff; border-radius: 20px; position: relative; }
                .wheel { width: 3px; height: 6px; background: var(--accent-gold); border-radius: 2px; position: absolute; top: 6px; left: 50%; transform: translateX(-50%); animation: mouseWheel 2s linear infinite; }
                @keyframes mouseWheel { 0% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, 15px); } }
                .scroll-indicator span { font-size: 0.6rem; font-weight: 800; letter-spacing: 4px; color: #fff; }

                @media (max-width: 1024px) {
                    .process-layout, .footer-grid, .promo-card { grid-template-columns: 1fr; gap: 60px; }
                    .footer-links { gap: 40px; flex-wrap: wrap; }
                    .hero-root { text-align: center; justify-content: center; }
                    .hero-content-container { align-items: center; }
                    .hero-actions { justify-content: center; }
                    .parallax-item { display: none; }
                }
                
                @media (max-width: 768px) {
                    .btn-gold-lg, .btn-glass-lg { width: 100%; text-align: center; }
                    .cta-content-wrapper h2 { font-size: 3.5rem; letter-spacing: -2px; }
                    .promo-text h2 { font-size: 2.5rem; }
                    .app-buttons { flex-direction: column; }
                    .new-tag { margin: 0 auto; }
                }
            `}</style>
        </div>
    );
};

const StatusRow = ({ label, status }: { label: string; status: string }) => {
    const active = status === 'live';
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
           <span style={{ fontSize: '0.85rem', color: '#888' }}>{label}</span>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: active ? 'var(--success)' : '#fbbf24', letterSpacing: '1px' }}>{status.toUpperCase()}</span>
              <div className={`status-dot ${status}`} style={{ width: '8px', height: '8px' }}></div>
           </div>
        </div>
    );
};

export default Landing;

