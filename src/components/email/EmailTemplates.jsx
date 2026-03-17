export const EMAIL_TEMPLATES = [
  {
    id: 'money_transfer_welcome',
    name: 'Welcome – Money Transfer',
    subject: '💸 Welcome to Taper Payer – Send Money Globally!',
    category: 'Money Transfer',
    body_html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#3D7BB7 0%,#61AF39 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:120px;width:auto;max-width:300px;display:block;margin:0 auto 20px auto;object-fit:contain;" />
    <h1 style="color:#ffffff;font-size:28px;margin:0;font-weight:bold;">Welcome to Taper Payer!</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:16px;margin-top:10px;">Your trusted partner for global money transfers</p>
  </div>
  <div style="padding:40px 30px;">
    <p style="font-size:16px;color:#334155;line-height:1.7;">Hello,</p>
    <p style="font-size:16px;color:#334155;line-height:1.7;">Welcome to <strong>Taper Payer</strong> – the fast, secure, and affordable way to send money to your loved ones anywhere in the world.</p>
    <div style="background:#f0f9ff;border-left:4px solid #3D7BB7;padding:20px;border-radius:0 8px 8px 0;margin:25px 0;">
      <h3 style="color:#1e3a5f;margin:0 0 12px;">Why thousands choose Taper Payer:</h3>
      <ul style="color:#475569;line-height:1.8;margin:0;padding-left:18px;">
        <li>⚡ <strong>Instant to next-day delivery</strong> to 150+ countries</li>
        <li>🔒 <strong>Bank-level security</strong> on every transfer</li>
        <li>💰 <strong>Competitive exchange rates</strong> with no hidden fees</li>
        <li>📱 <strong>Mobile top-up</strong> to any phone worldwide</li>
      </ul>
    </div>
    <div style="text-align:center;margin:35px 0;">
      <a href="https://taperpayer.com/TaperPayerHome" style="background:linear-gradient(135deg,#3D7BB7,#61AF39);color:#ffffff;padding:16px 36px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Send Money Now →</a>
    </div>
    <p style="font-size:14px;color:#64748b;line-height:1.7;">Questions? Our support team is available 24/7. Reply to this email or call us at <strong>404-994-0766</strong>.</p>
  </div>
</div>`
  },
  {
    id: 'money_transfer_promo',
    name: 'Promo – Zero Fee Transfer',
    subject: '🎉 Limited Time: Send Money with ZERO Fees – Taper Payer',
    category: 'Money Transfer',
    body_html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#1e293b;padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:120px;width:auto;max-width:300px;display:block;margin:0 auto 16px auto;object-fit:contain;" />
    <div style="background:#F88F2B;color:#ffffff;font-size:13px;font-weight:bold;padding:6px 16px;border-radius:20px;display:inline-block;margin-bottom:16px;">LIMITED TIME OFFER</div>
    <h1 style="color:#ffffff;font-size:32px;margin:0;">Send Money with <span style="color:#F88F2B;">ZERO Fees</span></h1>
    <p style="color:#94a3b8;font-size:15px;margin-top:10px;">This week only – for all money transfers worldwide</p>
  </div>
  <div style="padding:40px 30px;">
    <p style="font-size:16px;color:#334155;line-height:1.7;">Great news! For a limited time, you can send money to your family and friends with <strong>absolutely zero transfer fees</strong>.</p>
    <div style="background:#fef9ee;border:2px dashed #F88F2B;border-radius:12px;padding:25px;text-align:center;margin:25px 0;">
      <p style="font-size:14px;color:#92400e;margin:0 0 8px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Use promo code</p>
      <p style="font-size:36px;font-weight:900;color:#F88F2B;letter-spacing:4px;margin:0;">ZEROFEE</p>
      <p style="font-size:13px;color:#92400e;margin:8px 0 0;">Valid until Sunday midnight</p>
    </div>
    <div style="display:flex;gap:16px;margin:25px 0;flex-wrap:wrap;">
      <div style="flex:1;min-width:140px;background:#f0fdf4;border-radius:10px;padding:18px;text-align:center;">
        <div style="font-size:28px;margin-bottom:8px;">🇳🇬</div>
        <div style="font-weight:bold;color:#166534;">Nigeria</div>
        <div style="font-size:13px;color:#4ade80;">Best rate today</div>
      </div>
      <div style="flex:1;min-width:140px;background:#f0fdf4;border-radius:10px;padding:18px;text-align:center;">
        <div style="font-size:28px;margin-bottom:8px;">🇬🇭</div>
        <div style="font-weight:bold;color:#166534;">Ghana</div>
        <div style="font-size:13px;color:#4ade80;">Best rate today</div>
      </div>
      <div style="flex:1;min-width:140px;background:#f0fdf4;border-radius:10px;padding:18px;text-align:center;">
        <div style="font-size:28px;margin-bottom:8px;">🇭🇹</div>
        <div style="font-weight:bold;color:#166534;">Haiti</div>
        <div style="font-size:13px;color:#4ade80;">Best rate today</div>
      </div>
    </div>
    <div style="text-align:center;margin:30px 0;">
      <a href="https://taperpayer.com/TaperPayerHome" style="background:#F88F2B;color:#ffffff;padding:16px 36px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Claim Your Free Transfer →</a>
    </div>
  </div>
</div>`
  },
  {
    id: 'mobile_topup_intro',
    name: 'Intro – Taper Mobile Top-Up',
    subject: '📱 Top Up Any Phone Instantly – Taper Mobile is Here!',
    category: 'Mobile Top-Up',
    body_html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:120px;width:auto;max-width:300px;display:block;margin:0 auto 20px auto;object-fit:contain;" />
    <div style="font-size:48px;margin-bottom:10px;">📱</div>
    <h1 style="color:#ffffff;font-size:28px;margin:0;">Introducing Taper Mobile</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:16px;margin-top:10px;">Instant airtime top-ups to 150+ countries in seconds</p>
  </div>
  <div style="padding:40px 30px;">
    <p style="font-size:16px;color:#334155;line-height:1.7;">Say goodbye to complicated mobile recharges. With <strong>Taper Mobile</strong>, you can top up any phone in the world instantly – from Nigeria to Haiti and everywhere in between.</p>
    <div style="display:grid;gap:16px;margin:25px 0;">
      <div style="display:flex;align-items:flex-start;gap:16px;background:#f8fafc;border-radius:10px;padding:16px;">
        <span style="font-size:24px;">⚡</span>
        <div><strong style="color:#1e293b;">Instant Delivery</strong><br/><span style="color:#64748b;font-size:14px;">Airtime credited in seconds, no delays.</span></div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;background:#f8fafc;border-radius:10px;padding:16px;">
        <span style="font-size:24px;">🌍</span>
        <div><strong style="color:#1e293b;">150+ Countries</strong><br/><span style="color:#64748b;font-size:14px;">Works with hundreds of operators worldwide.</span></div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;background:#f8fafc;border-radius:10px;padding:16px;">
        <span style="font-size:24px;">💳</span>
        <div><strong style="color:#1e293b;">Multiple Payment Options</strong><br/><span style="color:#64748b;font-size:14px;">Pay with card, bank transfer, or Moncash.</span></div>
      </div>
    </div>
    <div style="text-align:center;margin:30px 0;">
      <a href="https://taperpayer.com/TaperPayerTopUp" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#ffffff;padding:16px 36px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Top Up a Phone Now →</a>
    </div>
  </div>
</div>`
  },
  {
    id: 'mobile_topup_reminder',
    name: 'Reminder – Top Up for Family',
    subject: '📞 Don\'t Let Your Family Run Out of Airtime – Top Up Now',
    category: 'Mobile Top-Up',
    body_html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#0f172a;padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:120px;width:auto;max-width:300px;display:block;margin:0 auto 20px auto;object-fit:contain;" />
    <h1 style="color:#ffffff;font-size:26px;margin:0;">Stay Connected With<br/>Your Loved Ones 🤝</h1>
    <p style="color:#94a3b8;font-size:15px;margin-top:10px;">A quick top-up keeps the conversation going</p>
  </div>
  <div style="padding:40px 30px;">
    <p style="font-size:16px;color:#334155;line-height:1.7;">We know how important it is to stay in touch with family back home. With <strong>Taper Mobile</strong>, a 30-second top-up ensures they're never unreachable.</p>
    <div style="background:#fef3c7;border-radius:12px;padding:25px;margin:25px 0;text-align:center;">
      <p style="font-size:18px;font-weight:bold;color:#92400e;margin:0 0 8px;">Top Up Popular Countries</p>
      <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-top:16px;">
        <div style="text-align:center;"><div style="font-size:32px;">🇳🇬</div><div style="font-size:12px;color:#78350f;font-weight:600;">Nigeria</div></div>
        <div style="text-align:center;"><div style="font-size:32px;">🇬🇭</div><div style="font-size:12px;color:#78350f;font-weight:600;">Ghana</div></div>
        <div style="text-align:center;"><div style="font-size:32px;">🇭🇹</div><div style="font-size:12px;color:#78350f;font-weight:600;">Haiti</div></div>
        <div style="text-align:center;"><div style="font-size:32px;">🇰🇪</div><div style="font-size:12px;color:#78350f;font-weight:600;">Kenya</div></div>
        <div style="text-align:center;"><div style="font-size:32px;">🇸🇳</div><div style="font-size:12px;color:#78350f;font-weight:600;">Senegal</div></div>
      </div>
    </div>
    <div style="text-align:center;margin:30px 0;">
      <a href="https://taperpayer.com/TaperPayerTopUp" style="background:#F88F2B;color:#ffffff;padding:16px 36px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Send Airtime Now →</a>
    </div>
  </div>
</div>`
  },
  {
    id: 'monthly_newsletter',
    name: 'Monthly Newsletter',
    subject: '📰 Taper Payer Monthly Update – Rates, News & More',
    category: 'Newsletter',
    body_html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#1e3a5f 0%,#3D7BB7 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:120px;width:auto;max-width:300px;display:block;margin:0 auto 16px auto;object-fit:contain;" />
    <p style="color:rgba(255,255,255,0.75);font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Monthly Newsletter</p>
    <h1 style="color:#ffffff;font-size:26px;margin:0;">What's New at Taper Payer</h1>
  </div>
  <div style="padding:40px 30px;">
    <div style="border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <div style="background:#3D7BB7;padding:14px 20px;"><h3 style="color:#fff;margin:0;font-size:16px;">💸 Money Transfer Update</h3></div>
      <div style="background:#f8fafc;padding:20px;"><p style="color:#475569;line-height:1.7;margin:0;">We've added 12 new countries to our money transfer network! Send money faster than ever to Africa, the Caribbean, and Southeast Asia with our lowest fees of the year.</p></div>
    </div>
    <div style="border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <div style="background:#06b6d4;padding:14px 20px;"><h3 style="color:#fff;margin:0;font-size:16px;">📱 Taper Mobile News</h3></div>
      <div style="background:#f8fafc;padding:20px;"><p style="color:#475569;line-height:1.7;margin:0;">Taper Mobile now supports 50 new operators! Top up phones in Morocco, Algeria, Ethiopia, and more – all in under 30 seconds.</p></div>
    </div>
    <div style="border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <div style="background:#61AF39;padding:14px 20px;"><h3 style="color:#fff;margin:0;font-size:16px;">🔥 Best Exchange Rates This Month</h3></div>
      <div style="background:#f8fafc;padding:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#ecfdf5;"><td style="padding:10px 12px;font-weight:bold;color:#065f46;">🇳🇬 USD → NGN</td><td style="padding:10px 12px;text-align:right;color:#059669;font-weight:bold;">Great Rate ↑</td></tr>
          <tr><td style="padding:10px 12px;font-weight:bold;color:#1e293b;">🇬🇭 USD → GHS</td><td style="padding:10px 12px;text-align:right;color:#059669;font-weight:bold;">Great Rate ↑</td></tr>
          <tr style="background:#ecfdf5;"><td style="padding:10px 12px;font-weight:bold;color:#065f46;">🇭🇹 USD → HTG</td><td style="padding:10px 12px;text-align:right;color:#059669;font-weight:bold;">Great Rate ↑</td></tr>
        </table>
      </div>
    </div>
    <div style="text-align:center;margin:30px 0;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="https://taperpayer.com/TaperPayerHome" style="background:#3D7BB7;color:#ffffff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">Send Money</a>
      <a href="https://taperpayer.com/TaperPayerTopUp" style="background:#61AF39;color:#ffffff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">Top Up Mobile</a>
    </div>
  </div>
</div>`
  },
  {
    id: 'reactivation',
    name: 'Re-engagement Campaign',
    subject: '👋 We Miss You – Here\'s Something Special from Taper Payer',
    category: 'Re-engagement',
    body_html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#7c3aed 0%,#db2777 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:120px;width:auto;max-width:300px;display:block;margin:0 auto 20px auto;object-fit:contain;" />
    <div style="font-size:48px;margin-bottom:8px;">👋</div>
    <h1 style="color:#ffffff;font-size:28px;margin:0;">We Miss You!</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:15px;margin-top:10px;">It's been a while – here's what's new</p>
  </div>
  <div style="padding:40px 30px;">
    <p style="font-size:16px;color:#334155;line-height:1.7;">We've been busy building new features while you were away. Here's what you've been missing at Taper Payer:</p>
    <div style="margin:25px 0;space-y:12px;">
      <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#faf5ff;border-radius:8px;margin-bottom:12px;">
        <span style="font-size:22px;">🚀</span><span style="color:#4c1d95;font-size:15px;"><strong>Faster transfers</strong> – Money arrives up to 2x faster than before</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#fdf2f8;border-radius:8px;margin-bottom:12px;">
        <span style="font-size:22px;">📱</span><span style="color:#831843;font-size:15px;"><strong>Taper Mobile</strong> – New instant top-up service for any phone</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px;">
        <span style="font-size:22px;">💰</span><span style="color:#166534;font-size:15px;"><strong>Better rates</strong> – Lowest exchange rates we've ever offered</span>
      </div>
    </div>
    <div style="background:#1e293b;border-radius:12px;padding:25px;text-align:center;margin:25px 0;">
      <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Special comeback offer</p>
      <p style="color:#f8fafc;font-size:18px;font-weight:bold;margin:0;">Free transfer on your next <br/>money transfer or top-up</p>
    </div>
    <div style="text-align:center;margin:30px 0;">
      <a href="https://taperpayer.com/TaperPayerHome" style="background:linear-gradient(135deg,#7c3aed,#db2777);color:#ffffff;padding:16px 36px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Come Back & Save →</a>
    </div>
  </div>
</div>`
  },
];

export const TEMPLATE_CATEGORIES = ['All', 'Money Transfer', 'Mobile Top-Up', 'Newsletter', 'Re-engagement'];