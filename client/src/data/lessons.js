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
        type: 'verdict',
        prompt: `Your professor “shared a file” with you. Safe or phishing?`,
        visual: {
          type: 'email',
          fromName: `Dr. Elena Morris via DocShare`,
          fromAddr: `no-reply@docshare-files.net`,
          subject: `Elena shared “Midterm grades – FINAL.xlsx” with you`,
          body: `<p>Dr. Elena Morris has shared a spreadsheet with you.</p>
                 <p>To view it, sign in with your <strong>Springfield State email and password</strong>.</p>
                 <p><span class="v-btn" data-href="https://docshare-files.net/auth/springfieldstate-login" tabindex="0">Open in DocShare</span></p>`
        },
        options: [`✅ Safe`, `🎣 Phishing`],
        answer: 1,
        explain: `Curiosity bait (“grades”!) plus a request to type your school password on a site that isn't your school's. A real shared file opens from your school account, not a random login page.`
      },
      {
        type: 'mcq',
        prompt: `Which of these is SPEAR phishing rather than ordinary phishing?`,
        options: [
          `A message naming your real soccer club, your coach and Saturday's match, asking you to pay the “tournament fee” through a link`,
          `“Your account will be closed” sent to 50,000 random addresses`,
          `A pop-up saying you are the 1,000,000th visitor and won a phone`,
          `A text from an unknown number saying “a package” is delayed`
        ],
        answer: 0,
        explain: `Spear phishing is personal: the attacker researched you (club, coach, match) so the message feels real. The others are sent to everyone and hope someone bites.`
      },
      {
        type: 'mcq',
        prompt: `An email from “your bank” uses your full name, shows the last 4 digits of your card correctly and has zero typos. It asks you to “verify your identity” through a link. What's the smartest conclusion?`,
        options: [
          `It's real — a scammer couldn't know those details`,
          `It could still be phishing — details like these leak in data breaches. Open the bank's app yourself instead`,
          `It's real because there are no spelling mistakes`,
          `Reply to the email and ask if it's genuine`
        ],
        answer: 1,
        explain: `Names and last-4 digits are often stolen in data breaches, and good grammar is easy. The safe move never changes: go to the bank yourself, not through the link. Replying just reaches the scammer.`
      },
      {
        type: 'tf',
        prompt: `A message that makes you feel excited or curious (not scared) can still be phishing.`,
        answer: true,
        explain: `“You have a secret admirer”, “See who viewed your profile”, “You won!” — good feelings rush you just as well as fear does.`
      },
      {
        type: 'mcq',
        prompt: `Oops — you clicked a phishing link, but you did NOT type anything or download anything. What's the best next move?`,
        options: [
          `Go back and type fake details to waste the scammer's time`,
          `Nothing at all — clicking can never cause any problem`,
          `Close the page, run a security scan, and report the message`,
          `Forward the email to friends so they can see it`
        ],
        answer: 2,
        explain: `Close it, scan, report. Feeding fake details still confirms your account is active, and forwarding spreads the trap. Usually just opening a page is low-risk, but a quick scan is cheap insurance.`
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
        type: 'mcq',
        prompt: `Link detective 🔍 Which of these REALLY goes to northbridge.com?`,
        options: [
          `https://northbridge.com.account-check.net/login`,
          `https://northbridge-com.secure-login.org`,
          `https://www.northbr1dge.com/login`,
          `https://login.northbridge.com/account`
        ],
        answer: 3,
        explain: `Read the domain just before the first single “/”. “login.northbridge.com” is a sub-address of northbridge.com — fine. The others end in account-check.net, secure-login.org, or swap “i” for “1”.`
      },
      {
        type: 'verdict',
        prompt: `This one looks a bit scary. Safe or phishing?`,
        visual: {
          type: 'email',
          fromName: `Springfield State IT Security`,
          fromAddr: `security@springfieldstate.edu`,
          subject: `New sign-in to your student account`,
          body: `<p>Hi Jordan,</p>
                 <p>We noticed a new sign-in to your account from <strong>Chrome on Windows</strong> (Springfield, US) at 9:14 AM.</p>
                 <p>If this was you, you don't need to do anything. If it wasn't, open the student portal and choose <strong>Security → Change password</strong>.</p>`
        },
        options: [`✅ Safe`, `🎣 Phishing`],
        answer: 0,
        explain: `Scary topic, but every sign is good: the real .edu address, your name, no link, no attachment, and it tells you to go to the portal yourself. Not every alert is a trap!`
      },
      {
        type: 'mcq',
        prompt: `Your shift manager “Jessica Lin” emails from jessica.lin.store@freemail.com: “Busy with a customer — can you buy 3 gift cards for her and send me photos of the codes? I'll pay you back today.” What's the BIGGEST red flag?`,
        options: [
          `A work request from a personal free-email address, asking for gift-card codes`,
          `She signed with her first name only`,
          `The email is very short`,
          `She promised to pay you back the same day`
        ],
        answer: 0,
        explain: `Anyone can create “jessica.lin.store” on a free email site. Pair that with gift-card codes (untraceable cash) and it's a classic boss scam. Call Jessica on her known number.`
      },
      {
        type: 'mcq',
        prompt: `A classmate's account sends you an unexpected attachment with “here u go 👍”. Which is the SAFEST thing to do?`,
        options: [
          `Open it — it's from someone you know`,
          `Ask the classmate (by text or in person) whether they really sent it before opening`,
          `Open it, but only if it's a .zip file`,
          `Open it and click “Enable Content” if it asks`
        ],
        answer: 1,
        explain: `Hacked accounts message all their contacts. A 10-second check with your classmate beats a week of cleaning up malware.`
      },
      {
        type: 'tf',
        prompt: `If you hover over a link and the address matches the text exactly, the email is definitely safe.`,
        answer: false,
        explain: `The link check is just one clue. The email could still ask you to call a fake phone number, open an attachment or reply with information. Check the sender and the request too.`
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
        prompt: `Crack-time challenge ⏱️ Which password would take an attacker the LONGEST to crack?`,
        options: [`Tr0ub4dor&3`, `P@$$w0rd2026!`, `correct-horse-battery-staple`, `Qx7!pZ`],
        answer: 2,
        explain: `Length wins. The 28-character passphrase has far more possible combinations than the short “complex” ones — and attackers already know tricks like @ for a and 0 for o.`
      },
      {
        type: 'mcq',
        prompt: `“Liverpool1892” (her team + its founding year) is Maya's password on 6 sites. One of them gets breached. Which statement is TRUE?`,
        options: [
          `Only the breached site is at risk`,
          `She's safe because the password has letters and numbers`,
          `She's safe if she changes her username`,
          `All 6 accounts are at risk, and the password was guessable anyway`
        ],
        answer: 3,
        explain: `Attackers try leaked passwords on other sites (credential stuffing). And a team plus a year is one of the first patterns cracking tools try.`
      },
      {
        type: 'tf',
        prompt: `Updating your password by changing the number each year (Summer2025 → Summer2026) keeps you safe.`,
        answer: false,
        explain: `Attackers who see the old password will simply try the next number. A new password should have nothing in common with the old one.`
      },
      {
        type: 'mcq',
        prompt: `Which is the SAFEST way to keep track of 40 different passwords?`,
        options: [
          `A password manager locked with a strong master passphrase and 2FA`,
          `A note on your phone called “Passwords”`,
          `A spreadsheet on your laptop's desktop`,
          `Saved in the browser of a shared library computer`
        ],
        answer: 0,
        explain: `A password manager encrypts everything and only fills passwords on the correct websites. Notes, spreadsheets and shared computers are easy pickings.`
      },
      {
        type: 'mcq',
        prompt: `An attacker has a list of 10 million leaked passwords. Which of YOUR passwords is most at risk?`,
        options: [
          `A random 20-character password from a password manager`,
          `“iloveyou123”, used on your gaming and email accounts`,
          `A 4-word random passphrase used on only one site`,
          `A passphrase with a symbol in the middle, used on one site`
        ],
        answer: 1,
        explain: `“iloveyou123” is almost certainly on that list, and it's reused, so one hit opens two accounts.`
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
        type: 'verdict',
        prompt: `Legit or scam?`,
        visual: { type: 'sms', sender: `Mark – Springfield State IT`, number: `+1 (555) 014-2290`, text: `Hi Jordan, this is Mark from IT. We're fixing a login bug on your account. You'll get a 6-digit code in a moment — please text it back to me so I can finish the fix. Thanks!` },
        options: [`✅ Legit`, `🚩 Scam`],
        answer: 1,
        explain: `Friendly, uses your name, sounds technical… but asks for your verification code. That code is the key to your account. Real IT staff never need it.`
      },
      {
        type: 'mcq',
        prompt: `A delivery driver in a real-looking uniform, arms full of boxes, asks you to tap your key card so he can get into your office building. Which trick is this?`,
        options: [
          `Baiting — he's tempting you with a package`,
          `Quid pro quo — trading a delivery for access`,
          `Tailgating, using the uniform as “authority” and your wish to be helpful`,
          `Vishing — it's a request made with his voice`
        ],
        answer: 2,
        explain: `Tailgating is getting through a locked door on someone else's access. The uniform and full arms make saying no feel rude. Offer to call reception instead.`
      },
      {
        type: 'mcq',
        prompt: `A caller says they're from your bank's fraud team and there's a suspicious payment. What's the BEST response?`,
        options: [
          `Answer their security questions so they can confirm it's you`,
          `Ask them to read your card number to prove they're real`,
          `Stay on the line, but don't share any codes`,
          `Say you'll call back, hang up, and call the number on the back of your card`
        ],
        answer: 3,
        explain: `Hang up and call a number you trust. Scammers can fake caller ID and may already know your card number, so “proof” on the call means nothing.`
      },
      {
        type: 'mcq',
        prompt: `The “Dean” emails: “In a meeting, can't talk. Need a quick favor — reply ASAP.” If you reply, what's the scammer's most likely NEXT message?`,
        options: [
          `A request to buy gift cards or send money “for a student event”`,
          `An invitation to a real meeting`,
          `Your updated grades`,
          `A thank-you note`
        ],
        answer: 0,
        explain: `This is a warm-up: get you talking first, then ask for money. “Can't talk” stops you from calling to check.`
      },
      {
        type: 'tf',
        prompt: `Social engineers often start by asking for something small and harmless (like your class schedule) before asking for something valuable.`,
        answer: true,
        explain: `Small favors build trust, and every bit of information makes the next lie more believable. It's called the “foot in the door” technique.`
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
        prompt: `Which post gives away the MOST answers to common password-reset security questions?`,
        options: [
          `“Happy 10th birthday to Biscuit, my first pet ever! 🐶”`,
          `“Throwback to Maple Street Elementary, class of 2014, with Mom (née Garcia) ❤️”`,
          `“Studying for finals, wish me luck 📚”`,
          `“Rainy day again ☔”`
        ],
        answer: 1,
        explain: `It reveals your elementary school AND your mother's maiden name, two classic security questions in one post. The pet post gives away one; the others give away none.`
      },
      {
        type: 'mcq',
        prompt: `You got front-row concert tickets 🎉 What's the safest way to show them off?`,
        options: [
          `Post the full ticket — it's only valid for one night`,
          `Post a close-up of just the barcode so people can't see your name`,
          `Post it, but cover the QR code/barcode and the order number`,
          `Post the full ticket to your story — it disappears in 24 hours`
        ],
        answer: 2,
        explain: `The barcode IS the ticket. Anyone can copy it and get in before you. Stories can be screenshotted in a second.`
      },
      {
        type: 'tf',
        prompt: `If your account is private, nothing you post can ever be seen by strangers.`,
        answer: false,
        explain: `Followers can screenshot and share your posts, and fake accounts sometimes get accepted. Private helps a lot, but post as if it could go public.`
      },
      {
        type: 'mcq',
        prompt: `A friend who's ALREADY on your friend list sends you a new friend request from a second account. What should you do?`,
        options: [
          `Accept — you already know them`,
          `Accept, then ask for their password to make sure it's them`,
          `Block your friend's original account`,
          `Check with your friend another way first; it may be a cloned fake account`
        ],
        answer: 3,
        explain: `Scammers copy a real person's photos and name, then ask their friends for money or codes. A quick text to your friend settles it.`
      },
      {
        type: 'mcq',
        prompt: `Which photo detail is the most dangerous to leave in a public post?`,
        options: [
          `Your house number and street sign in the background`,
          `Your favorite coffee cup`,
          `Your cat sleeping on the couch`,
          `The book you're reading`
        ],
        answer: 0,
        explain: `Your house number and street together tell a stranger exactly where you live. Always check the background before you post.`
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
        prompt: `At Springfield Airport you see three open networks. The sign on the wall says “Free Wi-Fi: SPR-Airport-Guest”. Which do you join to check your flight?`,
        options: [`Free_Airport_WiFi_FAST`, `SPR Airport Guest 2 (strongest signal)`, `SPR-Airport-Guest`],
        answer: 2,
        explain: `Use the exact name on the official sign. Look-alikes, especially “FAST” or a “2”, are classic evil twins, and a strong signal can just mean the attacker is sitting near you.`
      },
      {
        type: 'mcq',
        prompt: `On café Wi-Fi, your email suddenly shows “Your connection is not private” with a certificate warning. What do you do?`,
        options: [
          `Click “Advanced → Proceed anyway”`,
          `Refresh until the warning disappears`,
          `Stop, disconnect from the Wi-Fi and use mobile data instead`,
          `Turn off your antivirus — it might be blocking the page`
        ],
        answer: 2,
        explain: `On public Wi-Fi this warning can mean someone is intercepting your connection. Never click past it for email or banking.`
      },
      {
        type: 'tf',
        prompt: `The padlock (HTTPS) in the address bar means a website is trustworthy.`,
        answer: false,
        explain: `The padlock only means the connection is encrypted. Scam sites get padlocks too — it says nothing about who runs the site.`
      },
      {
        type: 'mcq',
        prompt: `Which laptop setting is safest on public Wi-Fi?`,
        options: [
          `Network discovery and file sharing ON, so you can share files with friends`,
          `Bluetooth set to “discoverable by everyone”`,
          `“Automatically join open networks” ON`,
          `Network set to “Public” with file sharing OFF`
        ],
        answer: 3,
        explain: `“Public” mode hides your laptop from other devices on the network. Sharing, discoverable Bluetooth and auto-join all open doors for strangers.`
      },
      {
        type: 'mcq',
        prompt: `Which of these does a VPN NOT protect you from?`,
        options: [
          `You typing your password into a phishing website`,
          `Other people on the café Wi-Fi reading your traffic`,
          `The Wi-Fi owner seeing which websites you visit`,
          `Someone snooping on unencrypted data on the network`
        ],
        answer: 0,
        explain: `A VPN protects the connection, not your decisions. If you hand your password to a fake site, the VPN delivers it safely… to the scammer.`
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
        prompt: `Which is the STRONGEST second factor?`,
        options: [`A code sent by SMS`, `A hardware security key or passkey`, `A code sent by email`, `A security question`],
        answer: 1,
        explain: `Security keys and passkeys only work on the real website, so they can't be phished. SMS and email codes can be stolen, and a security question isn't a second factor at all.`
      },
      {
        type: 'mcq',
        prompt: `A text arrives: “Your verification code is 482913. Don't share it with anyone.” You did NOT try to log in. What does this most likely mean?`,
        options: [
          `It's a harmless glitch`,
          `Your phone has a virus`,
          `Someone has your password and is trying to log in`,
          `Your account was deleted`
        ],
        answer: 2,
        explain: `The code was sent because someone got past step 1 (your password). 2FA just stopped them. Change that password now.`
      },
      {
        type: 'mcq',
        prompt: `Right after that text, someone calls: “Sorry, we sent you a code by mistake — please read it to me so we can cancel it.” What's really going on?`,
        options: [
          `They're helping you cancel a fraud attempt`,
          `It's an automatic bank security check`,
          `They're trying to send you a refund`,
          `They need your code to log in as you`
        ],
        answer: 3,
        explain: `There's no such thing as “cancelling” a code by reading it out. The caller is the attacker, and the code is the last thing they need.`
      },
      {
        type: 'tf',
        prompt: `With 2FA turned on, it doesn't matter if your password is weak.`,
        answer: false,
        explain: `2FA is a second lock, not a replacement for the first one. A weak password makes attackers' lives easier, and some 2FA methods (like SMS) can be bypassed.`
      },
      {
        type: 'mcq',
        prompt: `You can only set up 2FA on ONE account today. Which should it be?`,
        options: [`Your email`, `A recipe website`, `A game you stopped playing`, `A weather app`],
        answer: 0,
        explain: `Your email is the master key: “forgot password” links for almost every other account go there. Protect it first.`
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
        type: 'verdict',
        prompt: `Great deal or scam?`,
        visual: { type: 'listing', title: `PS5 bundle + 2 controllers`, price: `$150`, text: `Brand new, still sealed! Moving abroad tomorrow so must sell TODAY. Payment by gift card or crypto only, I'll ship it to you.`, seller: `Posted by “Alex_88” · account created 2 days ago` },
        options: [`✅ Legit`, `🚩 Scam`],
        answer: 1,
        explain: `Way below the normal price, a brand-new account, “must sell today”, and gift card or crypto payment. Every red flag in one listing.`
      },
      {
        type: 'verdict',
        prompt: `Money talk. Legit or scam?`,
        visual: {
          type: 'email',
          fromName: `Springfield State Financial Aid`,
          fromAddr: `finaid@springfieldstate.edu`,
          subject: `Your fall scholarship has been applied`,
          body: `<p>Hi Jordan,</p>
                 <p>Your Merit Scholarship (<strong>$1,500</strong>) has been applied to your fall balance.</p>
                 <p>You can see the details in the student portal under <strong>Finances</strong>. No action is needed.</p>`
        },
        options: [`✅ Legit`, `🚩 Scam`],
        answer: 0,
        explain: `It comes from the real .edu address, asks for nothing, includes no link or fee, and points you to the portal yourself. Scholarship scams always want a “processing fee” or your details.`
      },
      {
        type: 'mcq',
        prompt: `A buyer for your bike “accidentally” sends you a $500 check instead of $150 and asks you to send back the extra $350. What happens next?`,
        options: [
          `You keep $150 and everyone's happy`,
          `The check bounces days later, and you've lost the $350 you sent`,
          `Your bank covers any problems with checks`,
          `The buyer sends you a second check to fix it`
        ],
        answer: 1,
        explain: `This is the overpayment scam. Banks make check money available before they confirm it's real, so when it bounces, the $350 you sent is gone.`
      },
      {
        type: 'mcq',
        prompt: `A friendly person you met online weeks ago says they made huge profits on a crypto trading app and offers to help you start. What's this called?`,
        options: [
          `A legit tip from a friend`,
          `Smishing`,
          `An investment (“pig butchering”) scam`,
          `Tailgating`
        ],
        answer: 2,
        explain: `Scammers build a relationship for weeks (“fattening the pig”), then show fake profits on a fake app. Deposits can never be withdrawn.`
      },
      {
        type: 'tf',
        prompt: `Scammers can make a call or text appear to come from your bank's real phone number.`,
        answer: true,
        explain: `Caller ID can be faked (“spoofed”). A familiar number proves nothing. Hang up and call the number on your card.`
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
        prompt: `Which request for your Social Security number is NORMAL?`,
        options: [
          `A free T-shirt survey asks for it`,
          `A text from “the IRS” asks you to confirm it`,
          `A dating-app match asks for it to “verify” you`,
          `Your new employer's HR portal asks for it for tax forms`
        ],
        answer: 3,
        explain: `Employers need it for tax paperwork, through their official HR system. Surveys, texts and online matches never do.`
      },
      {
        type: 'mcq',
        prompt: `You're selling your old phone. What should you do FIRST?`,
        options: [
          `Back it up, sign out of your accounts, remove the SIM and do a full factory reset`,
          `Delete your photos one by one`,
          `Just turn it off and hand it over`,
          `Remove the case and screen protector`
        ],
        answer: 0,
        explain: `Deleting photos leaves accounts, messages and saved passwords behind. Signing out and a factory reset wipe everything properly.`
      },
      {
        type: 'mcq',
        prompt: `Which of these is the safest to post publicly?`,
        options: [
          `Your new driver's license — first time driving! 🚗`,
          `A café selfie with nothing personal in the background`,
          `Your boarding pass, barcode and all`,
          `Your keys on the kitchen table next to mail showing your address`
        ],
        answer: 1,
        explain: `IDs, barcodes and addressed mail are gold for identity thieves. A selfie with a clean background shares the moment, not your data.`
      },
      {
        type: 'tf',
        prompt: `Once you delete a public post, it's gone forever.`,
        answer: false,
        explain: `Screenshots, shares and web archives can keep it alive. Think before you post, not after.`
      },
      {
        type: 'mcq',
        prompt: `A letter says a credit card was opened in your name, but you never applied for one. What's the best FIRST move?`,
        options: [
          `Ignore it — it's probably a mistake`,
          `Call the phone number printed in the letter right away`,
          `Look up the card company's official fraud number yourself, report it, and check your credit report`,
          `Post about it on social media to warn friends`
        ],
        answer: 2,
        explain: `Act fast, but through numbers you find yourself. The letter itself could be part of a scam. Checking your credit report shows what else was opened.`
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
    summary: `Put everything together! Ten random questions from every lesson, against the clock. Score 70% or more for a big finish. 🏆`,
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
                 <li>⌛ If time runs out, the question counts as wrong. These are the trickiest questions in CyberQuest, so read every option!</li>
                 <li>🏆 Score <strong>70% or more</strong> to unlock the grand finale.</li>
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
        prompt: `Family emergency? Legit or scam?`,
        visual: { type: 'sms', sender: `Unknown number`, number: `+1 (555) 010-4477`, text: `Hi sweetie it's Mom 💕 I dropped my phone in water, this is my new number. Can you send me $200 in gift cards? I can't talk right now, I'll explain later.` },
        options: [`✅ Legit`, `🚩 Scam`],
        answer: 1,
        explain: `The “Hi Mom” scam: a new number, a reason they can't call, and an urgent gift-card request. Call your mom on her known number to check.`
      },
      {
        type: 'mcq',
        prompt: `A QR code sticker on a parking meter says “Scan to pay — faster!” What's the safest choice?`,
        options: [
          `Scan it and pay quickly`,
          `Scan it, but only pay small amounts`,
          `Scan it and check the page has a padlock`,
          `Pay at the meter itself or through the city's official parking app`
        ],
        answer: 3,
        explain: `Fake QR stickers placed over real ones (“quishing”) lead to fake payment pages, and those can have padlocks too. Use the official payment method.`
      },
      {
        type: 'mcq',
        prompt: `Which link is MOST likely the real student portal?`,
        options: [
          `https://portal.springfieldstate.edu/home`,
          `https://springfieldstate.edu.login-portal.net`,
          `http://springfie1dstate.edu/portal`,
          `https://springfieldstate-portal.co/login`
        ],
        answer: 0,
        explain: `Only “portal.springfieldstate.edu” ends in the real domain. The others end in login-portal.net, swap “l” for “1”, or use a look-alike .co domain.`
      },
      {
        type: 'mcq',
        prompt: `Your friend's account messages you: “Vote for me in this contest!! 🙏” The link asks you to log in to your social media account to vote. What's the best move?`,
        options: [
          `Log in and vote — it's your friend`,
          `Don't log in. Message your friend another way — their account is probably hacked`,
          `Log in with a different password to be safe`,
          `Share the link so more people vote`
        ],
        answer: 1,
        explain: `“Vote for me” links are a top way hacked accounts spread. Logging in hands over your account too, and it then messages all YOUR friends.`
      },
      {
        type: 'mcq',
        prompt: `You just realized you typed your email password into a fake login page 😱 What should you do FIRST?`,
        options: [
          `Delete the phishing email`,
          `Tell your friends what happened`,
          `Change your email password, plus anywhere you reused it, and turn on 2FA`,
          `Run a virus scan`
        ],
        answer: 2,
        explain: `Speed matters. Lock the attacker out by changing the password before they do. Everything else can come after.`
      }
    ]
  }
];

/** Finds a lesson by id (number or string). */
export const getLesson = id => LESSONS.find(l => l.id === Number(id)) || null;
