/* =====================================================================
 * data/lessons.js — Course content for CyberQuest
 * ---------------------------------------------------------------------
 * All lesson text, practice-activity settings and quiz questions.
 * Kept separate from the components ("content as data"), so editing a
 * lesson never requires touching React code.
 *
 * Lesson:   { id, title, icon, color, minutes, badge, summary,
 *             sections[{heading, body(html)}], takeaways[], activity, quiz[] }
 * Question: { type:"mcq"|"tf"|"verdict", prompt, options, answer, explain, visual? }
 *
 * Every company, person, phone number and address below is fictional.
 * ===================================================================== */

/* Levels unlocked by total XP (header pill + Progress page). */
export const LEVELS = [
  { min: 0,   name: 'Phish Food' },
  { min: 100, name: 'Click Cadet' },
  { min: 250, name: 'Scam Spotter' },
  { min: 450, name: 'Firewall Friend' },
  { min: 650, name: 'Cyber Detective' }
];

/* Fun titles for a single quiz result, picked by percentage score. */
export const RESULT_TITLES = [
  { min: 90, title: 'Cyber Detective!', emoji: '🕵️', message: 'Outstanding! Scammers would have a very hard time fooling you.' },
  { min: 70, title: 'Scam Spotter', emoji: '🛡️', message: 'Great job — you caught most of the traps. Review any misses below to level up.' },
  { min: 50, title: 'Click Cadet', emoji: '🎯', message: 'Not bad! You are getting there. Re-read the lesson and try again to earn the badge.' },
  { min: 0,  title: 'Phish Food', emoji: '🐟', message: 'Uh-oh, the phishers got you this time! Review the lesson and try again — everyone starts somewhere.' }
];

export const LESSONS = [
  /* ================================================================= */
  /* LESSON 1 — WHAT IS PHISHING?                                       */
  /* ================================================================= */
  {
    id: 1,
    title: `What Is Phishing?`,
    icon: 'hook',
    color: '#6366f1',
    minutes: 4,
    badge: `Bait Detector`,
    summary: `Phishing is a trick where attackers pretend to be someone you trust so you will hand over passwords, money or personal data.`,
    sections: [
      {
        heading: `The bait and the hook`,
        body: `<p><strong>Phishing</strong> is a cyberattack in which a criminal pretends to be a trusted person or organization — your bank, your university, a delivery company, even a friend — to trick you into clicking a link, opening an attachment, or giving away information.</p>
               <p>The name is a play on <em>fishing</em>: the attacker throws out bait (a convincing message) and waits for someone to bite.</p>`
      },
      {
        heading: `Why phishing works`,
        body: `<p>Phishing targets <strong>people, not computers</strong>. Instead of breaking through security software, it uses emotions to make us act before we think:</p>
               <ul>
                 <li><strong>Fear</strong> — “Your account will be closed.”</li>
                 <li><strong>Urgency</strong> — “Act within 24 hours!”</li>
                 <li><strong>Curiosity</strong> — “See who viewed your profile.”</li>
                 <li><strong>Greed</strong> — “You have won a $500 gift card!”</li>
               </ul>`
      },
      {
        heading: `What attackers want`,
        body: `<ul>
                 <li>Your <strong>login details</strong> (email, student portal, bank).</li>
                 <li>To install <strong>malware</strong> on your device through a link or file.</li>
                 <li><strong>Money</strong> — payments, gift cards, “fees”.</li>
                 <li><strong>Personal information</strong> they can use for identity theft.</li>
               </ul>
               <p class="callout">💡 <strong>Golden rule:</strong> if a message makes you feel rushed or scared, pause. That feeling is exactly what the attacker wants.</p>`
      }
    ],
    takeaways: [
      `Phishing = pretending to be someone trusted to steal information or money.`,
      `It can arrive by email, text, phone call, social media or even a QR code.`,
      `When in doubt, go to the official website or app yourself — never through the message link.`
    ],
    activity: {
      type: 'flipCards',
      title: `Meet the phishing family`,
      instructions: `Phishing comes in many forms. Tap or click each card to flip it and learn how it works.`,
      cards: [
        { emoji: '📧', title: `Email phishing`, text: `Mass emails sent to thousands of people hoping a few will click.`, example: `“Your mailbox is full. Log in now to keep receiving mail.”` },
        { emoji: '🎯', title: `Spear phishing`, text: `A targeted message that uses your real details to look believable.`, example: `An email from “your professor” that names your actual course and asks you to open a “grade sheet”.` },
        { emoji: '💬', title: `Smishing`, text: `Phishing by SMS / text message (SMS + phishing).`, example: `“ParcelPost: your package is on hold. Pay the $1.99 fee here…”` },
        { emoji: '📞', title: `Vishing`, text: `Voice phishing — a phone call from a fake bank, police officer or tech support.`, example: `“This is your bank’s fraud team. Please read me the code we just texted you.”` },
        { emoji: '🐋', title: `Whaling`, text: `Spear phishing aimed at “big fish” such as managers, deans or CEOs.`, example: `A fake legal notice sent only to the university president.` },
        { emoji: '🔳', title: `Quishing`, text: `Phishing with QR codes that lead to fake websites.`, example: `A sticker QR code on a parking meter that opens a fake payment page.` }
      ]
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `Which statement best describes phishing?`,
        options: [
          `A virus that spreads through USB drives`,
          `A trick where attackers pretend to be a trusted source to steal information`,
          `A way to speed up your internet connection`,
          `A type of firewall that blocks hackers`
        ],
        answer: 1,
        explain: `Phishing is social trickery: the attacker impersonates someone you trust so you willingly hand over information or money.`
      },
      {
        type: 'tf',
        prompt: `Phishing only happens through email.`,
        answer: false,
        explain: `Phishing also arrives by text (smishing), phone calls (vishing), social media messages and QR codes (quishing).`
      },
      {
        type: 'mcq',
        prompt: `A message says: “Your student account will be DELETED in 2 hours unless you verify now!” Which tactic is it using?`,
        options: [`Curiosity`, `Urgency and fear`, `Gratitude`, `Humour`],
        answer: 1,
        explain: `Short deadlines and threats create panic so you act before you think — a classic phishing tactic.`
      },
      {
        type: 'mcq',
        prompt: `You get a text message with a link claiming to be from a delivery company. What is this type of attack called?`,
        options: [`Vishing`, `Whaling`, `Smishing`, `Quishing`],
        answer: 2,
        explain: `Smishing = SMS + phishing. Delivery-fee texts are one of the most common examples.`
      },
      {
        type: 'verdict',
        prompt: `Is this email safe or a phishing attempt?`,
        visual: {
          type: 'email',
          fromName: `Northbridge Bank Security`,
          fromAddr: `alerts@northbridge-secure-login.co`,
          subject: `Unusual sign-in attempt detected`,
          body: `<p>Dear valued customer,</p>
                 <p>We detected suspicious activity on your account. Confirm your identity within <strong>12 hours</strong> or your account will be locked.</p>
                 <p><span class="v-btn" data-href="http://northbridge-secure-login.co/verify" tabindex="0">Verify Now</span></p>`
        },
        options: [`✅ Safe`, `🎣 Phishing`],
        answer: 1,
        explain: `Red flags: a look-alike domain (northbridge-secure-login.co), a generic greeting and a scary 12-hour deadline. Open your banking app directly instead.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 2 — SPOT THE FAKE EMAIL                                     */
  /* ================================================================= */
  {
    id: 2,
    title: `Spot the Fake Email`,
    icon: 'mail',
    color: '#0ea5e9',
    minutes: 5,
    badge: `Inbox Inspector`,
    summary: `Learn the red flags that give phishing emails away, and how to check where a link really goes before you click.`,
    sections: [
      {
        heading: `Read like a detective`,
        body: `<p>Before you click anything, scan the email for clues. Most phishing emails contain at least one red flag — and the more you find, the more likely the email is fake.</p>`
      },
      {
        heading: `The seven red flags`,
        body: `<ol>
                 <li><strong>Mismatched sender</strong> — the address does not match the organization (e.g. <code>support@northbridge-help.co</code> instead of <code>@northbridge.com</code>), or uses look-alike letters (rn instead of m, I instead of l).</li>
                 <li><strong>Generic greeting</strong> — “Dear Customer” instead of your name.</li>
                 <li><strong>Urgent or threatening language</strong> — capital letters, “!!!”, deadlines.</li>
                 <li><strong>Suspicious links</strong> — the real address (shown when you hover) is different from the text.</li>
                 <li><strong>Unexpected attachments</strong> — especially <code>.zip</code>, <code>.exe</code>, <code>.html</code>, or documents asking you to “enable macros”.</li>
                 <li><strong>Spelling and grammar mistakes</strong> or odd formatting.</li>
                 <li><strong>Requests for sensitive information</strong> — passwords, codes, card numbers.</li>
               </ol>`
      },
      {
        heading: `How to check a link safely`,
        body: `<p>On a computer, <strong>hover</strong> over a link and look at the address that appears in the corner of the window. On a phone, <strong>press and hold</strong> the link to preview it.</p>
               <p>Find the real domain by reading the part just before the first single slash <code>/</code>. In <code>https://northbridge.com.account-verify.net/login</code> the real domain is <strong>account-verify.net</strong> — not northbridge.com!</p>`
      }
    ],
    takeaways: [
      `Check the sender's full address, not just the display name.`,
      `Hover (or long-press) to see where a link really goes.`,
      `Real organizations will never ask for your password by email.`
    ],
    activity: {
      type: 'hotspots',
      title: `Find the red flags`,
      instructions: `This email landed in your inbox. Click every suspicious part you can find. Hint: hover over the button to see where it really leads.`,
      spots: {
        sender:     { label: `Fake sender address`, why: `“streamIy” uses a capital I instead of a lowercase l, and “streamIy-account-support.net” is not the company's real domain.` },
        urgency:    { label: `Pressure & urgency`, why: `ALL CAPS, “!!” and a 24-hour deadline are designed to make you panic instead of think.` },
        greeting:   { label: `Generic greeting`, why: `“Dear Costumer” (also misspelled!). A company you have an account with usually uses your name.` },
        grammar:    { label: `Poor grammar`, why: `“you're last payment” and “membership have been” — sloppy writing is a common sign of a scam.` },
        link:       { label: `Suspicious link`, why: `Hovering reveals the real destination: a .ru web address that has nothing to do with Streamly.` },
        attachment: { label: `Dangerous attachment`, why: `“Invoice_0923.pdf.exe” is a program pretending to be a PDF. Opening it could install malware.` }
      },
      html: `
        <div class="mock-email has-status">
          <div class="mock-toolbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="mock-app">Inbox — 1 new message</span></div>
          <div class="mock-email-head">
            <div class="mock-subject"><span data-hs="urgency">⚠ URGENT: Payment DECLINED – Account Suspended!!</span></div>
            <div class="mock-from">
              <span class="avatar avatar-red" aria-hidden="true">S</span>
              <div>
                <strong>Streamly Billing</strong>
                <span data-hs="sender" class="mock-addr">&lt;billing@streamIy-account-support.net&gt;</span>
                <div class="mock-to">to me · 7:42 AM</div>
              </div>
            </div>
          </div>
          <div class="mock-email-body">
            <p><span data-hs="greeting">Dear Costumer,</span></p>
            <p>We were unable to process <span data-hs="grammar">you're last payment and your membership have been suspended</span>.</p>
            <p>To avoid <span data-hs="urgency">permanent account deletion you must update your billing details within 24 hours</span>.</p>
            <p><span class="mock-btn" data-hs="link" data-href="http://streamly.billing-update-secure.ru/login">Update Payment Now</span></p>
            <p>Thank you,<br>The Streamly Billing Team</p>
          </div>
          <div class="mock-attach"><span data-hs="attachment">📎 Invoice_0923.pdf.exe <small>(312 KB)</small></span></div>
          <div class="status-bar" aria-hidden="true"></div>
        </div>`
    },
    quiz: [
      {
        type: 'verdict',
        prompt: `Is this email safe or a phishing attempt?`,
        visual: {
          type: 'email',
          fromName: `Springfield State IT Services`,
          fromAddr: `it-news@springfieldstate.edu`,
          subject: `Scheduled maintenance this Saturday`,
          body: `<p>Hi Jordan,</p>
                 <p>The student portal will be unavailable this Saturday from 2:00–4:00 AM for scheduled maintenance. <strong>No action is needed.</strong></p>
                 <p>Updates will be posted on the IT status page in the portal.</p>
                 <p>— IT Services</p>`
        },
        options: [`✅ Safe`, `🎣 Phishing`],
        answer: 0,
        explain: `This one is fine: it comes from the university's real domain, uses your name, asks for nothing and contains no links or attachments.`
      },
      {
        type: 'mcq',
        prompt: `What is the REAL domain in this web address?  https://northbridge.com.secure-login.info/account`,
        options: [`northbridge.com`, `secure-login.info`, `account`, `https`],
        answer: 1,
        explain: `Read the part just before the first single “/”. The domain is secure-login.info — “northbridge.com” is only a sub-domain decoy.`
      },
      {
        type: 'verdict',
        prompt: `Is this email safe or a phishing attempt?`,
        visual: {
          type: 'email',
          fromName: `HR Department`,
          fromAddr: `hr.payroll.department@freemail.com`,
          subject: `Salary adjustment – CONFIDENTIAL`,
          body: `<p>Hello,</p>
                 <p>Please review the attached document to see your salary increase. You must <strong>enable macros</strong> to view the file.</p>`,
          attachment: `Salary_Update.docm`
        },
        options: [`✅ Safe`, `🎣 Phishing`],
        answer: 1,
        explain: `HR would not use a free email account, and “enable macros” on an unexpected document is a classic way to install malware.`
      },
      {
        type: 'tf',
        prompt: `If an email shows the company's correct logo, it must be real.`,
        answer: false,
        explain: `Logos are easy to copy. Always check the sender's address, the links and what the email is asking you to do.`
      },
      {
        type: 'mcq',
        prompt: `You are not sure whether an email from your bank is real. What is the SAFEST next step?`,
        options: [
          `Reply to the email and ask if it is real`,
          `Click the link but do not type anything`,
          `Open the bank's app or type its web address yourself`,
          `Forward it to friends and ask what they think`
        ],
        answer: 2,
        explain: `Contact the organization through a channel you already trust. Replying goes straight to the scammer, and even clicking can be risky.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 3 — STRONG VS WEAK PASSWORDS                                */
  /* ================================================================= */
  {
    id: 3,
    title: `Strong vs. Weak Passwords`,
    icon: 'key',
    color: '#f59e0b',
    minutes: 5,
    badge: `Password Pro`,
    summary: `Find out how attackers crack passwords and how to create ones that are long, unique and still easy to remember.`,
    sections: [
      {
        heading: `How passwords get cracked`,
        body: `<p>Attackers do not guess passwords by hand. They use software that can try <strong>billions of combinations per second</strong>, starting with:</p>
               <ul>
                 <li>Lists of passwords leaked from previous data breaches.</li>
                 <li>Dictionary words with common swaps such as <code>P@ssw0rd</code>.</li>
                 <li>Personal details found online — names, pets, birthdays, teams.</li>
               </ul>
               <p>If one site leaks your password, attackers try the same email and password on many other sites. This is called <strong>credential stuffing</strong>.</p>`
      },
      {
        heading: `What makes a password strong`,
        body: `<p><strong>Length beats complexity.</strong> Every extra character multiplies the number of possible guesses. Aim for at least 14 characters.</p>
               <p>A <strong>passphrase</strong> of four or more random, unrelated words — like <code>violin-cactus-orbit-pancake</code> — is long, strong and surprisingly easy to remember.</p>
               <p>Avoid: personal information, keyboard patterns (<code>qwerty</code>, <code>123456</code>), single dictionary words, and simple swaps (<code>@</code> for <code>a</code>).</p>`
      },
      {
        heading: `One account, one password`,
        body: `<p>Reusing a password is the biggest risk of all — one leak unlocks everything. A <strong>password manager</strong> creates and remembers a unique password for every account, so you only need to memorize one strong master passphrase.</p>`
      }
    ],
    takeaways: [
      `Use long passphrases (14+ characters) instead of short, “clever” passwords.`,
      `Never reuse passwords across accounts.`,
      `Let a password manager do the remembering.`
    ],
    activity: {
      type: 'passwordLab',
      title: `Password strength lab`,
      instructions: `Type practice passwords to see how strong they are and roughly how long a computer would need to crack them. Try “P@ssw0rd!”, then try a passphrase. Reach “Strong” to complete the activity.`
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `Which of these passwords is the strongest?`,
        options: [`P@ssw0rd!`, `Fluffy2005`, `violin-cactus-orbit-pancake`, `qwerty123456`],
        answer: 2,
        explain: `The four-word passphrase is by far the longest and is not based on a common word or pattern.`
      },
      {
        type: 'tf',
        prompt: `Using the same strong password on every website is safe, as long as it is long.`,
        answer: false,
        explain: `If any one site is breached, attackers will try that password everywhere (credential stuffing). Every account needs its own password.`
      },
      {
        type: 'mcq',
        prompt: `What is “credential stuffing”?`,
        options: [
          `Adding extra symbols to make a password longer`,
          `Trying usernames and passwords leaked from one site on many other sites`,
          `Storing passwords in a password manager`,
          `Sharing your password with a trusted friend`
        ],
        answer: 1,
        explain: `Attackers automate logins with leaked credentials across hundreds of sites — which is why reuse is so dangerous.`
      },
      {
        type: 'mcq',
        prompt: `A friend's password is their dog's name plus their birth year (e.g. “Max2004”). What is the main problem?`,
        options: [
          `It is too long to remember`,
          `It contains a number`,
          `It uses personal details that are easy to find on social media`,
          `There is no problem`
        ],
        answer: 2,
        explain: `Pet names and birth years are often posted publicly, and they are among the first things attackers try.`
      },
      {
        type: 'mcq',
        prompt: `What is the best way to manage dozens of unique passwords?`,
        options: [
          `Write them on a sticky note on your monitor`,
          `Use one password with a small change for each site`,
          `Use a reputable password manager`,
          `Save them in a phone note called “passwords”`
        ],
        answer: 2,
        explain: `A password manager stores passwords encrypted, can generate strong ones, and fills them in only on the correct websites.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 4 — SOCIAL ENGINEERING                                      */
  /* ================================================================= */
  {
    id: 4,
    title: `Social Engineering`,
    icon: 'mask',
    color: '#ec4899',
    minutes: 6,
    badge: `Human Firewall`,
    summary: `Social engineers “hack humans” — they talk, charm or pressure people into breaking security rules. Learn their tricks.`,
    sections: [
      {
        heading: `Hacking the human`,
        body: `<p><strong>Social engineering</strong> means manipulating people into giving up information or access. Instead of breaking in through software, the attacker talks their way in — by phone, chat, email or in person.</p>`
      },
      {
        heading: `Common tactics`,
        body: `<ul>
                 <li><strong>Pretexting</strong> — an invented story: “Hi, I'm from IT and I need to fix your account.”</li>
                 <li><strong>Baiting</strong> — leaving a USB drive labelled “Salaries 2026” in a parking lot for someone to plug in.</li>
                 <li><strong>Tailgating</strong> — following someone through a locked door without swiping a card.</li>
                 <li><strong>Quid pro quo</strong> — offering a gift or “help” in exchange for information.</li>
                 <li><strong>Impersonating authority</strong> — pretending to be a dean, police officer or manager.</li>
               </ul>`
      },
      {
        heading: `The psychological triggers`,
        body: `<p>Social engineers rely on <strong>authority</strong>, <strong>urgency</strong>, <strong>scarcity</strong>, <strong>friendliness</strong> and our natural wish to be <strong>helpful</strong>.</p>
               <p class="callout">🛡️ <strong>Your defence:</strong> slow down, verify the person through a separate channel you already know (an official phone number or website), and remember — it is always OK to say no.</p>`
      }
    ],
    takeaways: [
      `Attackers target people because people are often easier to trick than software.`,
      `Real staff will never ask for your password or verification codes.`,
      `Verify through a separate, trusted channel before you act.`
    ],
    activity: {
      type: 'chat',
      title: `Chat with “IT support”`,
      instructions: `You receive a message on the campus chat app. Choose your replies and see where the conversation goes. Can you avoid being tricked?`,
      contact: { name: `Alex · IT Help Desk`, subtitle: `New contact · not in your address book` },
      start: 'n1',
      nodes: {
        n1: {
          messages: [`Hi! 👋 This is Alex from the Springfield State IT Help Desk.`, `We're moving all student accounts to a new email server tonight, and yours is flagged as not yet migrated.`],
          choices: [
            { text: `Oh no! What do I need to do?`, next: 'n2', tone: 'neutral', note: `Being helpful is natural — but stay alert.` },
            { text: `How do I know you're really from IT? I'll call the help desk number on the university website.`, next: 'winVerify', tone: 'good', note: `Verifying through an official channel is the perfect move.` }
          ]
        },
        n2: {
          messages: [`Easy! I just need to confirm it's really you.`, `Can you send me your student ID and password? I'll migrate everything for you in 2 minutes.`],
          choices: [
            { text: `Sure, my password is…`, next: 'losePassword', tone: 'bad', note: `Real IT staff never need your password.` },
            { text: `IT should never need my password. I'm not sharing that.`, next: 'n3', tone: 'good', note: `Correct — never share passwords.` }
          ]
        },
        n3: {
          messages: [`Totally understand, security first! 😊`, `OK, I'll send a 6-digit code to your phone instead. Just read it back to me. Hurry — migration closes in 10 minutes or you'll lose all your email!`],
          choices: [
            { text: `Got it — the code is 4 8 1…`, next: 'loseCode', tone: 'bad', note: `Verification codes are for you only.` },
            { text: `No. Codes are for me only. I'm reporting this to the real IT help desk.`, next: 'winReport', tone: 'good', note: `You spotted the urgency trick!` }
          ]
        },
        winVerify: {
          end: 'win',
          title: `You stopped the scam!`,
          text: `You verified the request using contact details you already trust. “Alex” immediately went silent — it was a scammer. Real IT teams are happy for you to double-check.`
        },
        winReport: {
          end: 'win',
          title: `Human firewall activated!`,
          text: `You refused to share your password AND your verification code, and spotted the fake deadline. Reporting the message helps protect other students too.`
        },
        losePassword: {
          end: 'lose',
          title: `Oops — account compromised`,
          text: `You just gave away your password. Real IT staff never ask for it. If this happens for real: change your password immediately, turn on 2FA and report it to the help desk.`
        },
        loseCode: {
          end: 'lose',
          title: `So close — but the attacker got in`,
          text: `That code was a login/reset code sent to your phone. Reading it out let the attacker into your account. Never share verification codes with anyone.`
        }
      }
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `A person in a delivery uniform with full arms asks you to hold the secure lab door open for them. What is this tactic called?`,
        options: [`Tailgating`, `Phishing`, `Baiting`, `Encryption`],
        answer: 0,
        explain: `Tailgating (or piggybacking) uses politeness to get through a locked door. Offer to call someone to let them in instead.`
      },
      {
        type: 'mcq',
        prompt: `You find a USB drive labelled “Exam Answers” in the library. What should you do?`,
        options: [
          `Plug it into your laptop to find the owner`,
          `Hand it to library staff or IT without plugging it in`,
          `Plug it into a library computer instead of yours`,
          `Take it home and check it later`
        ],
        answer: 1,
        explain: `This is baiting. Unknown USB drives can carry malware that runs as soon as they are connected.`
      },
      {
        type: 'tf',
        prompt: `A caller who knows your name and student ID number must be legitimate.`,
        answer: false,
        explain: `Those details are often leaked or found online. Knowing a few facts about you does not prove who someone is.`
      },
      {
        type: 'mcq',
        prompt: `“This offer is only available to the first 10 students!” Which psychological trigger is this?`,
        options: [`Authority`, `Scarcity`, `Helpfulness`, `Trust in technology`],
        answer: 1,
        explain: `Scarcity makes something feel valuable and pushes you to act quickly without thinking.`
      },
      {
        type: 'mcq',
        prompt: `The “Dean” emails you asking you to buy gift cards urgently and to keep it confidential. What is the best response?`,
        options: [
          `Buy them quickly — it's the Dean`,
          `Reply and ask for more details`,
          `Contact the Dean's office using the official university directory`,
          `Send your own card details instead`
        ],
        answer: 2,
        explain: `Gift cards + secrecy + urgency = scam. Verify using contact details you find yourself, not the ones in the message.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 5 — SAFE SOCIAL MEDIA HABITS                                */
  /* ================================================================= */
  {
    id: 5,
    title: `Safe Social Media Habits`,
    icon: 'share',
    color: '#8b5cf6',
    minutes: 5,
    badge: `Privacy Poster`,
    summary: `Small details you post online can be pieced together by scammers. Learn what to keep off your feed and how to lock down your settings.`,
    sections: [
      {
        heading: `Your digital footprint`,
        body: `<p>Everything you post builds a public picture of you. Attackers can combine small details — your school, your pet's name, your daily routine — to guess security answers, write convincing spear-phishing messages, or even find you in person.</p>`
      },
      {
        heading: `Think before you post`,
        body: `<ul>
                 <li>Never post <strong>boarding passes, tickets, IDs</strong> or anything with a barcode or QR code.</li>
                 <li>Share vacation photos <strong>after</strong> you get home.</li>
                 <li>Turn off <strong>precise location</strong> tags.</li>
                 <li>Check the <strong>background</strong> of photos for addresses, mail, screens or keys.</li>
                 <li>Skip “fun” quizzes like <em>“Your first pet + your street = your rock-star name”</em> — they collect security-question answers.</li>
               </ul>`
      },
      {
        heading: `Lock down your settings`,
        body: `<p>Set your accounts to <strong>private</strong> and review who can see your posts, friends list, tagged photos and contact details. Only accept requests from people you actually know — fake profiles are often used to gather information. Regularly remove third-party apps you no longer use.</p>`
      }
    ],
    takeaways: [
      `If you would not tell a stranger, do not post it publicly.`,
      `Post trips after you are back home.`,
      `Use private accounts and accept only people you know.`
    ],
    activity: {
      type: 'hotspots',
      title: `Spot the overshares`,
      instructions: `Maya is excited about her trip. Click every detail in her post that could help a scammer, stalker or burglar.`,
      spots: {
        public:   { label: `Public account`, why: `Anyone — including strangers and scammers — can see everything Maya posts. Friends-only or private is safer.` },
        away:     { label: `Announcing an empty home`, why: `Telling everyone the house will be empty for two weeks tells burglars exactly when to visit.` },
        boarding: { label: `Boarding pass with barcode`, why: `The barcode can contain her name and booking reference — enough for someone to view or change her trip.` },
        location: { label: `Exact home address`, why: `A precise location tag reveals where Maya lives. Combined with “away for 2 weeks”, that is a big risk.` },
        security: { label: `Security-question answers`, why: `Her birthday and her pet's name are classic security-question answers and common password ingredients.` }
      },
      html: `
        <div class="mock-post">
          <div class="mock-post-head">
            <span class="avatar avatar-pink" aria-hidden="true">M</span>
            <div><strong>maya.travels</strong><div class="mock-meta"><span data-hs="public">🌐 Public</span> · 2h</div></div>
          </div>
          <p class="mock-post-text"><span data-hs="away">Finally!! Leaving for 2 WEEKS in Bali tomorrow ✈️ the house is gonna be totally empty lol 😂</span></p>
          <div class="mock-photo" data-hs="boarding">
            <div class="boarding-pass">
              <div class="bp-top"><strong>BOARDING PASS</strong><span>NB AIR</span></div>
              <div class="bp-row"><div><small>PASSENGER</small>RIVERA / MAYA</div><div><small>FLIGHT</small>NB 482</div><div><small>SEAT</small>14A</div></div>
              <div class="bp-barcode" aria-hidden="true"></div>
            </div>
          </div>
          <div class="mock-loc"><span data-hs="location">📍 214 Maple Street, Springfield</span></div>
          <div class="mock-actions">♡ 48 &nbsp; 💬 12 &nbsp; ↗ Share</div>
          <div class="mock-comment"><strong>maya.travels</strong> <span data-hs="security">thx for all the bday wishes!! 20 years old on 03/14 🎂 and Biscuit 🐱 (best cat ever) is staying with grandma</span></div>
        </div>`
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `Which of these is the SAFEST to post publicly?`,
        options: [
          `A photo of your new driver's license`,
          `“Home alone all weekend!”`,
          `A sunset photo with no location tag`,
          `A photo of your concert ticket showing the barcode`
        ],
        answer: 2,
        explain: `A sunset photo without location data reveals nothing about who you are, where you live or when you are away.`
      },
      {
        type: 'tf',
        prompt: `Quizzes like “Your superhero name = your mother's maiden name + your first street” are harmless fun.`,
        answer: false,
        explain: `These quizzes are a sneaky way to collect common security-question answers.`
      },
      {
        type: 'mcq',
        prompt: `A stranger with no mutual friends and a brand-new profile sends you a friend request. What should you do?`,
        options: [`Accept — more followers is better`, `Accept and send them a message`, `Decline or ignore it`, `Reply with your phone number`],
        answer: 2,
        explain: `New profiles with no connections are often fake accounts used to collect information or start scams.`
      },
      {
        type: 'mcq',
        prompt: `When is the best time to post your vacation photos?`,
        options: [`Before you leave`, `While you are at the airport`, `Every hour while you are away`, `After you return home`],
        answer: 3,
        explain: `Posting afterwards means nobody knows in real time that your home is empty.`
      },
      {
        type: 'mcq',
        prompt: `Which settings change MOST improves your privacy?`,
        options: [
          `Changing your profile picture`,
          `Making your account private and limiting who sees your posts`,
          `Posting more often`,
          `Following more accounts`
        ],
        answer: 1,
        explain: `A private account controls who can see your information in the first place.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 6 — PUBLIC WI-FI DANGERS                                    */
  /* ================================================================= */
  {
    id: 6,
    title: `Public Wi-Fi Dangers`,
    icon: 'wifi',
    color: '#14b8a6',
    minutes: 5,
    badge: `Hotspot Hero`,
    summary: `Free Wi-Fi in cafés and airports is convenient but risky. Learn about “evil twin” networks and how to stay safe on the go.`,
    sections: [
      {
        heading: `Free Wi-Fi is not free of risk`,
        body: `<p>Coffee shops, airports and hotels offer free Wi-Fi, but <strong>open networks</strong> (no password) do not encrypt the connection between your device and the router. Other people on the same network may be able to snoop on unprotected traffic.</p>`
      },
      {
        heading: `Beware the evil twin`,
        body: `<p>An <strong>evil twin</strong> is a fake hotspot with a convincing name, such as <code>Airport_Free_WiFi</code> or <code>BeanThere-FREE</code>. Once you connect, the attacker can watch your traffic or show you fake login pages.</p>
               <p class="callout">☕ Always ask staff for the <strong>exact</strong> network name — and be suspicious of look-alikes.</p>`
      },
      {
        heading: `Staying safe on public networks`,
        body: `<ul>
                 <li>For banking or shopping, use <strong>mobile data</strong> or your phone's <strong>personal hotspot</strong>.</li>
                 <li>Use a <strong>trusted VPN</strong>, which encrypts your traffic in a private tunnel.</li>
                 <li>Look for <strong>HTTPS</strong> (the padlock) — but remember a padlock does not make a fake site real.</li>
                 <li>Turn off <strong>auto-join</strong> and <strong>file sharing</strong>; “forget” the network when you leave.</li>
               </ul>`
      }
    ],
    takeaways: [
      `Open networks are not encrypted — avoid sensitive tasks on them.`,
      `Confirm the exact network name with staff to avoid evil twins.`,
      `Mobile data, personal hotspots and VPNs are safer options.`
    ],
    activity: {
      type: 'explorer',
      title: `Pick a network`,
      instructions: `You are at Bean There Café. You want to submit an assignment and check your bank balance. The barista says the Wi-Fi is “BeanThere_Guest” and the password is on your receipt. Tap each network to see whether it is a good choice.`,
      options: [
        { label: `BeanThere-FREE`, sub: `Open network · no password`, secured: false, signal: 4, rating: 'risky', feedback: `Suspicious! A near-identical name with no password is a classic evil twin. Staff told you the real network is “BeanThere_Guest”.` },
        { label: `BeanThere_Guest`, sub: `Secured · password on receipt`, secured: true, signal: 3, rating: 'ok', feedback: `This is the café's real network (confirmed by staff) and it uses a password. Fine for submitting homework — but other customers share it, so avoid banking unless you use a VPN.` },
        { label: `Free Public WiFi`, sub: `Open network · unknown owner`, secured: false, signal: 2, rating: 'risky', feedback: `Unknown owner and no encryption. Anyone could be running this network — avoid it.` },
        { label: `My Phone Hotspot`, sub: `Your own phone · secured`, secured: true, signal: 4, rating: 'best', feedback: `Best choice for banking! Your personal hotspot uses your mobile data and a password only you know.` }
      ]
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `What is an “evil twin” network?`,
        options: [
          `Two routers in the same house`,
          `A fake hotspot that imitates a legitimate network`,
          `A virus that copies your files`,
          `A Wi-Fi signal booster`
        ],
        answer: 1,
        explain: `Attackers create hotspots with convincing names so people connect to them instead of the real network.`
      },
      {
        type: 'tf',
        prompt: `Checking your bank account on open airport Wi-Fi is perfectly safe if the connection is fast.`,
        answer: false,
        explain: `Speed says nothing about safety. Open networks can be monitored — use mobile data or a VPN instead.`
      },
      {
        type: 'mcq',
        prompt: `What is the safest way to pay a bill while you are at a café?`,
        options: [
          `The café's open Wi-Fi`,
          `The network with the strongest signal`,
          `Your phone's mobile data or personal hotspot`,
          `Any network with “Free” in its name`
        ],
        answer: 2,
        explain: `Your own mobile connection is not shared with strangers, making it the safest option.`
      },
      {
        type: 'mcq',
        prompt: `What does a VPN do on public Wi-Fi?`,
        options: [
          `Encrypts your traffic so others on the network cannot read it`,
          `Makes you completely invisible online`,
          `Doubles your internet speed`,
          `Removes all viruses from your device`
        ],
        answer: 0,
        explain: `A VPN creates an encrypted tunnel. It helps a lot, but it does not make you invisible or replace antivirus software.`
      },
      {
        type: 'mcq',
        prompt: `You have finished using hotel Wi-Fi. What is a good habit?`,
        options: [
          `Leave file sharing turned on`,
          `“Forget” the network and turn off auto-join`,
          `Post the Wi-Fi password online for others`,
          `Stay connected so it is faster next time`
        ],
        answer: 1,
        explain: `Forgetting the network stops your device from automatically joining it — or an evil twin with the same name — later.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 7 — TWO-FACTOR AUTHENTICATION                               */
  /* ================================================================= */
  {
    id: 7,
    title: `Two-Factor Authentication`,
    icon: 'phoneShield',
    color: '#22c55e',
    minutes: 5,
    badge: `Double Locker`,
    summary: `A password alone is one lock. Two-factor authentication adds a second, different lock so a stolen password is not enough.`,
    sections: [
      {
        heading: `One lock is not enough`,
        body: `<p>If someone steals or guesses your password, they are in — unless your account asks for a second proof. <strong>Two-factor authentication (2FA)</strong>, also called multi-factor authentication (MFA), requires two <em>different types</em> of evidence.</p>`
      },
      {
        heading: `The three factors`,
        body: `<ul>
                 <li>🧠 <strong>Something you know</strong> — a password, PIN or security answer.</li>
                 <li>📱 <strong>Something you have</strong> — your phone with an authenticator app, a security key, a smart card.</li>
                 <li>👆 <strong>Something you are</strong> — your fingerprint, face or voice.</li>
               </ul>
               <p>Two passwords are <strong>not</strong> 2FA — both are “something you know”.</p>`
      },
      {
        heading: `Not all 2FA is equal`,
        body: `<p>From strongest to weaker: <strong>security keys and passkeys</strong> → <strong>authenticator-app codes or push prompts</strong> → <strong>SMS text codes</strong> (which can be stolen through SIM-swapping, but are still far better than nothing).</p>
               <p class="callout">⚠️ <strong>MFA fatigue:</strong> if you get a login approval request you did not start, <strong>deny it</strong> and change your password. Keep your backup codes somewhere safe.</p>`
      }
    ],
    takeaways: [
      `2FA combines two different factor types: know, have, are.`,
      `Turn it on for email, school, banking and social media accounts.`,
      `Never approve a login prompt you did not start.`
    ],
    activity: {
      type: 'sorter',
      title: `Sort the factors`,
      instructions: `Put each item into the correct factor group. Click an item, then click a group (or drag and drop on a computer).`,
      buckets: [
        { id: 'know', label: `🧠 Something you know` },
        { id: 'have', label: `📱 Something you have` },
        { id: 'are',  label: `👆 Something you are` }
      ],
      items: [
        { label: `Password`, bucket: 'know', why: `A password is information stored in your memory.` },
        { label: `PIN number`, bucket: 'know', why: `A PIN is a short secret you remember.` },
        { label: `Security question answer`, bucket: 'know', why: `Answers like “first pet” are knowledge — and often guessable!` },
        { label: `Authenticator app on your phone`, bucket: 'have', why: `The codes only appear on a device you physically own.` },
        { label: `USB security key`, bucket: 'have', why: `A physical key you plug in or tap — one of the strongest options.` },
        { label: `Student ID smart card`, bucket: 'have', why: `A physical card with a chip is something you carry.` },
        { label: `Fingerprint`, bucket: 'are', why: `Biometrics are part of your body.` },
        { label: `Face scan`, bucket: 'are', why: `Your face is a biometric factor.` },
        { label: `Voice recognition`, bucket: 'are', why: `Your voice pattern is a biometric factor.` }
      ]
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `Which combination is TRUE two-factor authentication?`,
        options: [
          `Password + security question`,
          `Password + code from an authenticator app`,
          `Password + PIN`,
          `Two different passwords`
        ],
        answer: 1,
        explain: `Only this option combines two different factor types: something you know + something you have.`
      },
      {
        type: 'mcq',
        prompt: `Your phone shows “Approve sign-in?” but you are not logging in to anything. What do you do?`,
        options: [
          `Approve it so the messages stop`,
          `Deny it and change your password`,
          `Ignore it and hope it goes away`,
          `Approve it, then log out`
        ],
        answer: 1,
        explain: `An unexpected prompt means someone already has your password. Deny it, change the password, and report it if it is a school account.`
      },
      {
        type: 'tf',
        prompt: `SMS text-message codes are the strongest form of 2FA.`,
        answer: false,
        explain: `Security keys, passkeys and authenticator apps are stronger. SMS can be intercepted through SIM-swapping — though it is still much better than no 2FA.`
      },
      {
        type: 'mcq',
        prompt: `A fingerprint scan belongs to which factor?`,
        options: [`Something you know`, `Something you have`, `Something you are`, `Somewhere you are`],
        answer: 2,
        explain: `Fingerprints, faces and voices are biometric — “something you are”.`
      },
      {
        type: 'mcq',
        prompt: `Why should you save your 2FA backup codes?`,
        options: [
          `So you can share them with friends`,
          `So you can still log in if you lose your phone`,
          `They replace your password`,
          `You do not need to — they are useless`
        ],
        answer: 1,
        explain: `Backup codes are your emergency key if your phone is lost or broken. Store them somewhere safe and private.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 8 — RECOGNIZING SCAMS                                       */
  /* ================================================================= */
  {
    id: 8,
    title: `Recognizing Scams`,
    icon: 'alert',
    color: '#ef4444',
    minutes: 6,
    badge: `Scam Buster`,
    summary: `Fake jobs, prizes, tech-support pop-ups, rental deals… scams wear many costumes but follow the same script.`,
    sections: [
      {
        heading: `Every scam follows a script`,
        body: `<p>Online scams come in many costumes, but the script is almost always the same:</p>
               <ol>
                 <li>Create a strong <strong>emotion</strong> — excitement, fear, sympathy.</li>
                 <li>Invent a <strong>deadline</strong> so you cannot stop to think.</li>
                 <li>Ask for <strong>money or information</strong> in a way that is hard to trace or undo.</li>
               </ol>`
      },
      {
        heading: `Scams that target students`,
        body: `<ul>
                 <li><strong>Fake jobs</strong> — “Earn $500/week as an assistant! We'll mail you a check — deposit it, buy supplies and send back the rest.”</li>
                 <li><strong>Scholarship fees</strong> — “You've won a grant! Just pay a $50 processing fee.”</li>
                 <li><strong>Tech-support pop-ups</strong> — “Your computer is infected! Call this number now.”</li>
                 <li><strong>Rental scams</strong> — a cheap apartment, a landlord “overseas”, a deposit before viewing.</li>
                 <li><strong>Investment “opportunities”</strong> from new online friends promising quick crypto profits.</li>
               </ul>`
      },
      {
        heading: `Red flags of any scam`,
        body: `<ul>
                 <li>Payment by <strong>gift cards, wire transfer, crypto</strong> or payment apps.</li>
                 <li>It sounds <strong>too good to be true</strong>.</li>
                 <li>You are told to <strong>keep it secret</strong> or move to another app.</li>
                 <li>You cannot verify the person or company independently.</li>
               </ul>
               <p class="callout">📣 If you spot or fall for a scam: tell your bank, change passwords, and report it to the platform and your campus IT or security office. In the U.S. you can also report it at ReportFraud.ftc.gov.</p>`
      }
    ],
    takeaways: [
      `Emotion + deadline + hard-to-trace payment = scam.`,
      `Nobody legitimate asks to be paid in gift cards.`,
      `Report scams — it protects others too.`
    ],
    activity: {
      type: 'triage',
      title: `Scam or legit? Rapid fire`,
      instructions: `Six messages arrive on your phone and laptop. Decide quickly: scam or legit?`,
      cards: [
        {
          visual: { type: 'sms', sender: `+1 (305) 555-0199`, text: `CONGRATS! You've been selected for a $750 campus grocery gift card 🎉 Claim within 1 hr: bit.ly/claim-750-now` },
          answer: 'scam',
          why: `Unknown number, a prize you never entered for, a 1-hour deadline and a shortened link. Classic smishing.`
        },
        {
          visual: { type: 'popup', title: `Windows Defender Alert`, text: `⚠ WARNING! Your computer has 5 viruses. Do NOT close this window or your files will be deleted. Call Support now: 1-888-555-0142`, cta: `Call Now` },
          answer: 'scam',
          why: `Real security software never asks you to call a phone number from a browser pop-up. Close the tab (or the browser).`
        },
        {
          visual: { type: 'email', fromName: `Springfield State Library`, fromAddr: `library@springfieldstate.edu`, subject: `Reminder: book due Friday`, body: `<p>Hi Jordan,</p><p>“Intro to Psychology” is due back this Friday. You can renew it from your library account.</p>` },
          answer: 'legit',
          why: `Official domain, your name, no links to click and no request for information — a normal reminder.`
        },
        {
          visual: { type: 'sms', sender: `Recruiter Kate`, number: `via social media DM`, text: `Hi! Remote assistant job, $40/hr, no interview needed 😊 We'll send you a check — deposit it, then buy gift cards for our clients and send us the codes.` },
          answer: 'scam',
          why: `No interview, high pay, a check to deposit and gift cards to buy. The check will bounce after you have sent real money.`
        },
        {
          visual: { type: 'listing', title: `2-bed apartment downtown`, price: `$400 / month`, text: `Others nearby cost $1,500! I'm working overseas so you can't view it, but wire the deposit today and I'll mail you the keys.`, seller: `Posted by “Landlord Mike” · joined today` },
          answer: 'scam',
          why: `Far below market price, no viewing, an absent landlord and a wire-transfer deposit. Never pay before you have seen a place.`
        },
        {
          visual: { type: 'notification', app: `Northbridge Bank`, text: `You spent $12.40 at Campus Café. Not you? Review it in the app.` },
          answer: 'legit',
          why: `A notification inside your official banking app that matches a purchase you made. It asks you to check inside the app, not to click a link.`
        }
      ]
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `Which payment request is the BIGGEST red flag?`,
        options: [
          `Paying by credit card on a store's official website`,
          `Paying with gift cards`,
          `Paying tuition through the school's official portal`,
          `Paying in person at a shop`
        ],
        answer: 1,
        explain: `Gift cards are like cash — untraceable and impossible to get back. No real business or government agency asks to be paid this way.`
      },
      {
        type: 'verdict',
        prompt: `Is this text message legit or a scam?`,
        visual: { type: 'sms', sender: `+44 7700 900123`, text: `ParcelPost: Your package #PX2291 could not be delivered due to an unpaid customs fee ($1.99). Pay now to avoid return: parcelpost-redelivery.top/pay` },
        options: [`✅ Legit`, `🚩 Scam`],
        answer: 1,
        explain: `A random international number, a tiny “fee” to get your card details, and a strange .top web address. Check deliveries on the official app instead.`
      },
      {
        type: 'mcq',
        prompt: `A “job” sends you a check, asks you to deposit it and send part of the money back. Why is this a scam?`,
        options: [
          `It is not — this is how remote jobs work`,
          `The check will bounce after you have already sent real money`,
          `Banks prefer this kind of payment`,
          `It is just a test of your honesty`
        ],
        answer: 1,
        explain: `Fake checks can take days to bounce. By then your money is gone and you owe the bank the full amount.`
      },
      {
        type: 'tf',
        prompt: `Real tech-support companies show pop-up warnings asking you to call them immediately.`,
        answer: false,
        explain: `Legitimate companies never do this. Pop-ups with phone numbers are scams designed to get remote access to your computer or your money.`
      },
      {
        type: 'mcq',
        prompt: `You think you have been scammed. What should you do FIRST?`,
        options: [
          `Keep it secret because it is embarrassing`,
          `Pay the scammer more so they fix the problem`,
          `Contact your bank, change your passwords and report it`,
          `Delete everything and forget about it`
        ],
        answer: 2,
        explain: `Acting quickly can stop payments and protect your accounts. Scams happen to smart people — reporting is nothing to be ashamed of.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 9 — PROTECTING PERSONAL INFORMATION                         */
  /* ================================================================= */
  {
    id: 9,
    title: `Protecting Personal Information`,
    icon: 'idCard',
    color: '#f97316',
    minutes: 5,
    badge: `Data Guardian`,
    summary: `Your personal data is valuable to criminals. Learn what to share, what to keep private, and everyday habits that protect you.`,
    sections: [
      {
        heading: `Your data is valuable`,
        body: `<p><strong>Personally identifiable information (PII)</strong> is any data that can identify you: full name, birth date, address, phone number, student ID, Social Security number, bank details, passwords, photos of your ID.</p>
               <p>Criminals combine these pieces to commit <strong>identity theft</strong> — opening accounts, taking loans or taking over your accounts in your name.</p>`
      },
      {
        heading: `Share on a need-to-know basis`,
        body: `<p>Before you share, ask three questions:</p>
               <ol>
                 <li><strong>Who</strong> is asking — can I verify them?</li>
                 <li><strong>Why</strong> do they need it?</li>
                 <li>What happens <strong>if it leaks</strong>?</li>
               </ol>
               <p>Only enter sensitive data on official sites you navigated to yourself. Your Social Security number is rarely needed — it is fine to ask “Can I use a different identifier?”</p>`
      },
      {
        heading: `Everyday protection habits`,
        body: `<ul>
                 <li>Lock your devices with a PIN or biometrics, and turn on auto-lock and “find my device”.</li>
                 <li>Install <strong>software updates</strong> promptly — they fix security holes.</li>
                 <li><strong>Log out</strong> of shared and lab computers.</li>
                 <li>Shred paper documents that contain personal details.</li>
                 <li>Check bank statements regularly for unknown charges.</li>
                 <li>Back up important files.</li>
               </ul>`
      }
    ],
    takeaways: [
      `Treat personal data like money — do not hand it out freely.`,
      `Passwords, PINs and one-time codes should never be shared with anyone.`,
      `Updates, screen locks and logging out are simple but powerful habits.`
    ],
    activity: {
      type: 'sorter',
      title: `Share it or guard it?`,
      instructions: `Sort each piece of information into the right group. Click an item, then click a group (or drag and drop).`,
      buckets: [
        { id: 'public',  label: `🌍 OK to share publicly` },
        { id: 'trusted', label: `🤝 Only when needed, with trusted parties` },
        { id: 'never',   label: `🔒 Never share with anyone` }
      ],
      items: [
        { label: `Your favorite band`, bucket: 'public', why: `Harmless on its own — unless it is also your security answer!` },
        { label: `Your college major`, bucket: 'public', why: `Generally fine to share.` },
        { label: `Home address`, bucket: 'trusted', why: `Share only with trusted people and services that really need it (e.g. deliveries).` },
        { label: `Phone number`, bucket: 'trusted', why: `Useful to scammers — share only with people and services you trust.` },
        { label: `Full date of birth`, bucket: 'trusted', why: `Often used to verify identity, so keep it off public profiles.` },
        { label: `Social Security number`, bucket: 'trusted', why: `Only when legally required — e.g. an employer's tax forms or your bank. Never on social media or random forms.` },
        { label: `Account password`, bucket: 'never', why: `No real company, teacher or IT team will ever ask for your password.` },
        { label: `One-time verification code`, bucket: 'never', why: `These codes prove that YOU are logging in. Anyone asking for one is trying to break in.` },
        { label: `Bank card PIN`, bucket: 'never', why: `Even your bank will never ask for your PIN.` }
      ]
    },
    quiz: [
      {
        type: 'mcq',
        prompt: `Which of these is sensitive personally identifiable information (PII)?`,
        options: [`Your favorite color`, `Your Social Security number`, `Your favorite movie`, `Today's weather`],
        answer: 1,
        explain: `An SSN can be used to open credit and commit identity theft, so it needs strong protection.`
      },
      {
        type: 'mcq',
        prompt: `A website offering a “free T-shirt” asks for your Social Security number. What should you do?`,
        options: [
          `Enter it — the T-shirt is free`,
          `Enter a friend's number instead`,
          `Leave the site — no giveaway needs your SSN`,
          `Email it to them instead`
        ],
        answer: 2,
        explain: `Asking for highly sensitive data in exchange for a tiny reward is a data-harvesting scam.`
      },
      {
        type: 'tf',
        prompt: `Logging out of shared computers in the campus lab helps protect your personal information.`,
        answer: true,
        explain: `If you stay logged in, the next person could access your email, files and accounts.`
      },
      {
        type: 'mcq',
        prompt: `Which habit best protects your phone's data if it is lost?`,
        options: [
          `No screen lock, so it is easy to use`,
          `A sticker with your home address on the back`,
          `A strong screen lock plus “find my device” / remote wipe turned on`,
          `Saving all your passwords in a notes app`
        ],
        answer: 2,
        explain: `A screen lock stops strangers getting in, and remote wipe lets you erase your data if the phone is gone for good.`
      },
      {
        type: 'mcq',
        prompt: `Why should you install software and app updates promptly?`,
        options: [
          `Updates fix security holes that attackers exploit`,
          `Updates only add new emojis`,
          `Updates make your battery die faster`,
          `There is no real reason`
        ],
        answer: 0,
        explain: `Many attacks use known weaknesses that have already been fixed — but only on devices that installed the update.`
      }
    ]
  },

  /* ================================================================= */
  /* LESSON 10 — FINAL CYBERSECURITY CHALLENGE                          */
  /* ================================================================= */
  {
    id: 10,
    final: true,
    title: `Final Cybersecurity Challenge`,
    icon: 'trophy',
    color: '#eab308',
    minutes: 6,
    badge: `Cyber Champion`,
    summary: `Put everything together! Ten random questions from every lesson, against the clock. Score 70% or more to earn your certificate.`,
    sections: [
      {
        heading: `Put it all together`,
        body: `<p>The final challenge mixes questions from <strong>all nine lessons</strong>, plus a few brand-new scenarios. The questions are picked at random, so every attempt is different.</p>`
      },
      {
        heading: `Challenge rules`,
        body: `<ul>
                 <li>⏱️ <strong>10 questions</strong>, <strong>25 seconds</strong> each.</li>
                 <li>⚡ Answer correctly <strong>and</strong> quickly for up to <strong>+5 bonus XP</strong> per question.</li>
                 <li>⌛ If time runs out, the question counts as wrong.</li>
                 <li>🏆 Score <strong>70% or more</strong> to unlock your printable certificate.</li>
               </ul>
               <p class="callout">🧠 <strong>Quick refresher:</strong> check the sender, hover over links, never share passwords or codes, use passphrases + 2FA, avoid open Wi-Fi for sensitive tasks, and be suspicious of anything urgent.</p>`
      }
    ],
    takeaways: [
      `Pause before you click.`,
      `Verify through a channel you trust.`,
      `Protect your accounts with unique passphrases and 2FA.`
    ],
    activity: null,
    finalSettings: { count: 10, seconds: 25, maxBonus: 5 },
    // Extra questions that only appear in the final challenge
    quiz: [
      {
        type: 'verdict',
        prompt: `Is this email safe or a phishing attempt?`,
        visual: {
          type: 'email',
          fromName: `Campus Bookstore`,
          fromAddr: `orders@springfieldstate.edu`,
          subject: `Your order #48213 is ready for pickup`,
          body: `<p>Hi Sam,</p><p>Your textbook order is ready at the Campus Bookstore counter. Please bring your student ID. Opening hours: 9 AM – 6 PM.</p>`
        },
        options: [`✅ Safe`, `🎣 Phishing`],
        answer: 0,
        explain: `It uses the official domain and your name, matches an order you placed, and asks you to do something in person — no links or data requests.`
      },
      {
        type: 'verdict',
        prompt: `Is this text message legit or a scam?`,
        visual: { type: 'sms', sender: `Unknown number`, number: `+1 (555) 010-4477`, text: `Hi sweetie it's Mom 💕 I dropped my phone in water, this is my new number. Can you send me $200 in gift cards? I can't talk right now, I'll explain later.` },
        options: [`✅ Legit`, `🚩 Scam`],
        answer: 1,
        explain: `The “Hi Mom” scam: a new number, a reason they cannot call, and an urgent gift-card request. Call your mom on her known number to check.`
      },
      {
        type: 'mcq',
        prompt: `You see a QR code sticker on a parking meter that says “Scan to pay”. What is the safest choice?`,
        options: [
          `Scan it and pay quickly`,
          `Pay at the meter itself or through the city's official parking app`,
          `Scan it and enter your card, but only for small amounts`,
          `Share the QR code with friends`
        ],
        answer: 1,
        explain: `Fake QR stickers placed over real ones (quishing) lead to fake payment pages. Use the official payment method.`
      },
      {
        type: 'mcq',
        prompt: `Which overall strategy best protects your online accounts?`,
        options: [
          `One very complex password used everywhere`,
          `Unique passphrases stored in a password manager, plus 2FA`,
          `Short passwords you change every week`,
          `Your birthday with a symbol at the end`
        ],
        answer: 1,
        explain: `Unique + long + second factor is the winning combination.`
      },
      {
        type: 'mcq',
        prompt: `Which link is MOST likely to be the real student portal?`,
        options: [
          `https://springfieldstate.edu.login-portal.net`,
          `http://springfie1dstate.edu/portal`,
          `https://springfieldstate.edu/portal`,
          `https://springfieldstate-portal.co/login`
        ],
        answer: 2,
        explain: `Only this one has the real domain (springfieldstate.edu) right before the first “/”. The others use a different domain, a look-alike “1” or no HTTPS.`
      }
    ]
  }
];

/** Finds a lesson by id (number or string). */
export const getLesson = id => LESSONS.find(l => l.id === Number(id)) || null;
