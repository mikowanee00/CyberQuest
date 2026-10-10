/* =====================================================================
 * data/lessonExtras.js — Extra, interactive content for every lesson
 * ---------------------------------------------------------------------
 *   funFact    a short "Did you know?" fact
 *   terms      key cybersecurity terms (tap-to-reveal cards + glossary)
 *   scenarios  10 "What would you do?" situations per lesson
 *
 * Scenario format
 *   { title, story, visual?, ask?, term?,
 *     options: [{ text, ok?: true, says }] }   ← "says" is the feedback
 *   The option with ok: true is the best answer. `term` names one of the
 *   lesson's terms; its card is "unlocked" when the scenario is solved.
 *
 * Every person, company, number and message here is made up.
 * ===================================================================== */

export const LESSON_EXTRAS = {
  /* =============================================================== */
  /* 1. WHAT IS PHISHING?                                             */
  /* =============================================================== */
  1: {
    funFact: `The “ph” in phishing is a nod to early hackers called “phone phreakers”, who tricked telephone systems long before email existed.`,
    terms: [
      { term: `Phishing`, emoji: '🎣', def: `Pretending to be someone you trust to trick you into clicking, paying or sharing information.` },
      { term: `Spear phishing`, emoji: '🎯', def: `A phishing message made just for you, using real details like your club, job or friends.` },
      { term: `Smishing`, emoji: '💬', def: `Phishing by text message (SMS + phishing).` },
      { term: `Vishing`, emoji: '📞', def: `Phishing by phone call (voice + phishing).` },
      { term: `Quishing`, emoji: '🔳', def: `Phishing with QR codes that lead to fake websites.` },
      { term: `Credential harvesting`, emoji: '🧺', def: `Collecting usernames and passwords with fake login pages.` }
    ],
    scenarios: [
      {
        title: `The mailbox panic`,
        story: `An email says your school mailbox is 99% full and new messages will bounce in 24 hours unless you click “Upgrade storage” and sign in.`,
        term: `Credential harvesting`,
        options: [
          { text: `Click and sign in quickly before the deadline`, says: `That's the trap. The “upgrade” page is fake and keeps your password.` },
          { text: `Open the student portal yourself and check your storage`, ok: true, says: `Exactly. Going there yourself beats every fake link.` },
          { text: `Forward it to classmates to ask if they got it too`, says: `Not dangerous, but you're spreading the bait. Report it instead.` }
        ]
      },
      {
        title: `“Is this you?? 😳”`,
        story: `Your friend's account sends you a direct message: “omg is this you in this video??” with a link. The page asks you to log in to watch it.`,
        term: `Phishing`,
        options: [
          { text: `Log in, you need to see it`, says: `Ouch. That's how your friend's account got hacked, and now yours is too.` },
          { text: `Text your friend on another app: “Did you send me a video?”`, ok: true, says: `Smart. Their account is probably hacked, and now they know.` },
          { text: `Reply “send it here instead lol”`, says: `You're still chatting with whoever controls the hacked account. Check with your friend another way.` }
        ]
      },
      {
        title: `It knows my coach's name…`,
        story: `An email mentions your real soccer club, your coach Ms. Patel and Saturday's match. It asks you to pay the $25 “tournament fee” through a link today.`,
        term: `Spear phishing`,
        options: [
          { text: `Pay. It knows real details, so it must be legit`, says: `Those details are often on public team pages. Personal doesn't mean real.` },
          { text: `Ask Ms. Patel directly whether there's a fee`, ok: true, says: `Yes! Checking through a channel you already trust beats any spear phish.` },
          { text: `Pay, but with a different card`, says: `The card isn't the problem. The payment page itself is fake.` }
        ]
      },
      {
        title: `Text from “your bank”`,
        story: `This text arrives while you're in class:`,
        visual: { type: 'sms', sender: `NB-Alert`, number: `+1 (555) 019-3321`, text: `Northbridge Bank: Unusual sign-in detected on your account. Verify now to avoid suspension: nb-secure-verify.top` },
        ask: `Real alert or smishing?`,
        term: `Smishing`,
        options: [
          { text: `Real, banks send alerts`, says: `Banks do send alerts, but never with a link to a strange “.top” address. Open your banking app instead.` },
          { text: `Smishing: delete it and check in the official app`, ok: true, says: `Spot on. Odd sender, a scare, and a look-alike link.` }
        ]
      },
      {
        title: `The polite technician`,
        story: `A friendly caller from “your internet provider” says hackers are inside your router. They ask you to install a “remote help” app so they can fix it right now.`,
        term: `Vishing`,
        options: [
          { text: `Install the app so they can fix it`, says: `Remote-access apps give a stranger full control of your computer. That's their goal.` },
          { text: `Hang up and call the number on your provider's bill or website`, ok: true, says: `Perfect. If there's a real problem, the real company will confirm it.` },
          { text: `Just give them your Wi-Fi password instead`, says: `Still handing a stranger the keys. Hang up and verify.` }
        ]
      },
      {
        title: `20% off at the café`,
        story: `A sticker on your café table says “Scan for 20% off!”. The QR code opens a page asking for your card details and email password.`,
        term: `Quishing`,
        options: [
          { text: `Fill it in, 20% is a good deal`, says: `A discount never needs your email password. That sticker was placed by a scammer.` },
          { text: `Ask staff if the QR code is really theirs`, ok: true, says: `Nice! Fake stickers are often stuck over real ones.` },
          { text: `Enter only the card number, not the password`, says: `Half a scam is still a scam. Your card would be charged.` }
        ]
      },
      {
        title: `The director needs a favor`,
        story: `You volunteer at a charity. An email “from the director” says: “I'm in meetings all day. Please pay this supplier invoice urgently and keep it between us.”`,
        options: [
          { text: `Pay it, the director asked`, says: `Urgency plus secrecy plus payment is the classic boss scam.` },
          { text: `Call the director on their known number to confirm`, ok: true, says: `Exactly. A real director will be glad you checked.` },
          { text: `Reply to the email to confirm`, says: `Replying goes straight back to the scammer, who will happily say “yes”.` }
        ]
      },
      {
        title: `You WON! 🎉`,
        story: `“Congratulations! You've won a $500 campus store voucher. Claim it in the next hour by signing in with your student login.”`,
        options: [
          { text: `Claim it fast`, says: `You didn't enter any contest. Prizes that need your password are traps.` },
          { text: `Ignore it and report it as phishing`, ok: true, says: `Correct. Too good to be true usually is.` },
          { text: `Claim it with an old password`, says: `Still risky. Old passwords are often reused elsewhere.` }
        ]
      },
      {
        title: `No typos at all`,
        story: `A billing email from “Streamly” has the right logo and perfect grammar. The “Update payment” button goes to streamly-billing-help.com.`,
        ask: `Real or fake?`,
        term: `Phishing`,
        options: [
          { text: `Real, there are no mistakes`, says: `Plenty of phishing is perfectly written now. The domain gives it away.` },
          { text: `Fake: the domain isn't Streamly's. Check in the app`, ok: true, says: `Yes! Judge the link and the request, not the spelling.` }
        ]
      },
      {
        title: `Oops… you already typed it`,
        story: `Two minutes ago you typed your email password into a page that now looks fake. Your heart sinks.`,
        ask: `What do you do FIRST?`,
        options: [
          { text: `Change that password right now, and turn on 2FA`, ok: true, says: `Speed wins. Lock them out before they use it.` },
          { text: `Delete the email so you don't see it again`, says: `Deleting doesn't undo anything. The attacker already has your password.` },
          { text: `Wait to see if anything weird happens`, says: `Waiting gives the attacker time to change your password first.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 2. SPOT THE FAKE EMAIL                                           */
  /* =============================================================== */
  2: {
    funFact: `Scammers register look-alike web addresses. Swapping “m” for “rn” is a classic: at a glance, “strearnly.com” reads like “streamly.com”.`,
    terms: [
      { term: `Email spoofing`, emoji: '🎭', def: `Faking who an email seems to come from, for example a fake display name or reply-to address.` },
      { term: `Domain`, emoji: '🌐', def: `The main part of a web or email address, like springfieldstate.edu. It's the part to check.` },
      { term: `Typosquatting`, emoji: '🔤', def: `Registering look-alike domains with tiny typos (rn for m, 1 for l) to fool people.` },
      { term: `Malicious attachment`, emoji: '📎', def: `A file sent to infect your device, often disguised (like “invoice.pdf.exe”).` },
      { term: `Macro`, emoji: '⚙️', def: `A small program inside a document. Attackers hide malware in macros and ask you to “Enable Content”.` },
      { term: `Spam`, emoji: '🗑️', def: `Unwanted bulk email. Some spam is just annoying; some carries phishing or malware.` }
    ],
    scenarios: [
      {
        title: `Who's REALLY writing?`,
        story: `This lands in your inbox:`,
        visual: {
          type: 'email', fromName: `Springfield State IT`, fromAddr: `it.support@springfield-state-helpdesk.com`,
          subject: `Your password expires TODAY`,
          body: `<p>Dear student,</p><p>Your password expires in 3 hours. Keep your account active here:</p><p><span class="v-btn" data-href="https://springfield-state-helpdesk.com/keep-active" tabindex="0">Keep my password</span></p>`
        },
        ask: `Safe or fake?`,
        term: `Email spoofing`,
        options: [
          { text: `Safe, it says Springfield State IT`, says: `Anyone can type any display name. The real address isn't springfieldstate.edu.` },
          { text: `Fake: the sender's domain isn't the university's`, ok: true, says: `Nailed it. Always read the address, not just the name.` }
        ]
      },
      {
        title: `Hover hero`,
        story: `A link says “northbridge.com/login”. When you hover over it, the corner of the screen shows: http://northbridge.com.secure-update.biz/login`,
        ask: `Do you click?`,
        term: `Domain`,
        options: [
          { text: `Yes, it starts with northbridge.com`, says: `The real domain is the part just before the first “/”: secure-update.biz.` },
          { text: `No, the real domain is secure-update.biz`, ok: true, says: `Exactly. Starting with a familiar name proves nothing.` }
        ]
      },
      {
        title: `Attachment roulette`,
        story: `An unexpected email from an unknown company says “Your invoice is attached” and includes Invoice_0923.pdf.exe.`,
        term: `Malicious attachment`,
        options: [
          { text: `Open it to see what you owe`, says: `“.exe” is a program pretending to be a PDF. Opening it runs the malware.` },
          { text: `Don't open it. Delete it and report it`, ok: true, says: `Correct! The last extension is the real file type.` },
          { text: `Open it on your phone instead`, says: `Still risky. Unknown attachments shouldn't be opened at all.` }
        ]
      },
      {
        title: `“Enable Content to view”`,
        story: `You open a “shipping document” and it shows a blurry page with a yellow bar: “Enable Content to view this document.”`,
        term: `Macro`,
        options: [
          { text: `Click Enable Content`, says: `That runs the hidden macro, which is exactly how many infections start.` },
          { text: `Close it and report the email`, ok: true, says: `Yes! Real documents don't make you enable content just to read them.` }
        ]
      },
      {
        title: `The reply-to switcheroo`,
        story: `An email shows your professor's real address, but when you hit Reply, the “To” line changes to prof.morris.office@freemail.com.`,
        ask: `What's going on?`,
        term: `Email spoofing`,
        options: [
          { text: `Nothing, professors use many addresses`, says: `A hidden reply-to address is a spoofing trick to steer your answer to a scammer.` },
          { text: `The email may be spoofed. Contact the professor through the school system`, ok: true, says: `Great catch. Most people never look at the reply-to line.` }
        ]
      },
      {
        title: `strearnly.com`,
        story: `A billing email comes from billing@strearnly.com. You subscribe to “Streamly”.`,
        ask: `What's off?`,
        term: `Typosquatting`,
        options: [
          { text: `Nothing, it's Streamly`, says: `Look again: “rn” is pretending to be “m”.` },
          { text: `“rn” is pretending to be “m”: a look-alike domain`, ok: true, says: `Eagle eyes! 🦅 That's typosquatting.` },
          { text: `The “.com” ending is suspicious`, says: `.com is normal. The trick is in the letters before it.` }
        ]
      },
      {
        title: `The calm reminder`,
        story: `This one arrives on a Monday:`,
        visual: { type: 'email', fromName: `Springfield State Library`, fromAddr: `library@springfieldstate.edu`, subject: `Reminder: book due Friday`, body: `<p>Hi Jordan,</p><p>“Intro to Psychology” is due back this Friday. You can renew it from your library account.</p>` },
        ask: `Safe or fake?`,
        options: [
          { text: `Safe`, ok: true, says: `Right! Official domain, your name, no link, no request. Not everything is a trap.` },
          { text: `Fake`, says: `This one's fine: real .edu address, nothing to click, nothing to give.` }
        ]
      },
      {
        title: `ALL CAPS ENERGY`,
        story: `Subject line: “FINAL WARNING!!! ACCOUNT DELETION IN 2 HOURS!!!”`,
        ask: `What is this trying to do?`,
        options: [
          { text: `Make you panic so you act without thinking`, ok: true, says: `Yes. Urgency is the scammer's favorite tool.` },
          { text: `Give you good customer service`, says: `Real companies don't shout deadlines at you in capital letters.` },
          { text: `Nothing, it's just a formatting choice`, says: `It's deliberate: panic switches off careful thinking.` }
        ]
      },
      {
        title: `The tiny link`,
        story: `An email “from your bank” says “Check your statement” with a shortened link: bit.ly/3xQ9vL.`,
        options: [
          { text: `Click it, short links are normal`, says: `Short links hide where they go. Banks link to their own domain.` },
          { text: `Skip the link and open the bank's app yourself`, ok: true, says: `Perfect habit. Your app never lies about where it goes.` }
        ]
      },
      {
        title: `The unsubscribe trap`,
        story: `You get a spammy email for “miracle vitamins”. At the bottom there's a big “Unsubscribe” link.`,
        term: `Spam`,
        options: [
          { text: `Click Unsubscribe`, says: `With dodgy senders, clicking can confirm your address is active, so you get even more spam.` },
          { text: `Mark it as spam / junk and block the sender`, ok: true, says: `Yes! Your email app does the unsubscribing safely.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 3. STRONG VS. WEAK PASSWORDS                                     */
  /* =============================================================== */
  3: {
    funFact: `A four-word passphrase like “violin-cactus-orbit-pancake” is longer than most passwords, yet easier to remember because your brain can picture it.`,
    terms: [
      { term: `Brute-force attack`, emoji: '🔨', def: `Software tries every possible combination (aaaa, aaab, aaac…) until one works.` },
      { term: `Dictionary attack`, emoji: '📖', def: `Trying common words and passwords, plus swaps like @ for a and 0 for o.` },
      { term: `Credential stuffing`, emoji: '🧦', def: `Trying usernames and passwords leaked from one site on many other sites.` },
      { term: `Passphrase`, emoji: '🧩', def: `A password made of several random words. It's long, strong and easy to remember.` },
      { term: `Password manager`, emoji: '🗝️', def: `An app that creates, stores and fills in a unique password for every account.` },
      { term: `Data breach`, emoji: '💧', def: `When a company's data, such as passwords or emails, is stolen and leaked.` },
      { term: `Shoulder surfing`, emoji: '👀', def: `Watching someone type their password or PIN.` }
    ],
    scenarios: [
      {
        title: `Pick a winner`,
        story: `You're creating a new account. Which password do you choose?`,
        term: `Passphrase`,
        options: [
          { text: `Liverpool1892`, says: `A team plus a year is one of the first patterns attackers try.` },
          { text: `P@ssw0rd!`, says: `Looks clever, but it's on every attacker's list.` },
          { text: `tulip-rocket-gravel-canyon`, ok: true, says: `Long, random, and memorable. 🚀` }
        ]
      },
      {
        title: `Breaking news: breach!`,
        story: `A shopping site you use announces that its customer passwords were stolen.`,
        term: `Data breach`,
        options: [
          { text: `Change that password, plus anywhere you used the same one`, ok: true, says: `Exactly. Leaked passwords get tried everywhere.` },
          { text: `Do nothing, it's their fault`, says: `It's their fault, but your accounts are the ones at risk.` },
          { text: `Just delete the shopping account`, says: `Good tidying, but any other account using that password is still exposed.` }
        ]
      },
      {
        title: `One key, six doors`,
        story: `Attackers take emails and passwords leaked from a gaming site and automatically try them on email, banking and social media sites.`,
        ask: `What's this called?`,
        term: `Credential stuffing`,
        options: [
          { text: `Brute-force attack`, says: `Brute force guesses every combination. This reuses real leaked logins.` },
          { text: `Credential stuffing`, ok: true, says: `Yes! That's why every account needs its own password.` },
          { text: `Shoulder surfing`, says: `That's watching someone type. This is automated reuse of leaked logins.` }
        ]
      },
      {
        title: `The guessing machine`,
        story: `A program tries “aaaa”, “aaab”, “aaac”… billions of times per second until it finds your password.`,
        ask: `Which attack is this?`,
        term: `Brute-force attack`,
        options: [
          { text: `Dictionary attack`, says: `A dictionary attack uses word lists. This tries every combination.` },
          { text: `Brute-force attack`, ok: true, says: `Right. Long passwords make this take centuries.` }
        ]
      },
      {
        title: `Clever swaps?`,
        story: `Your cousin's password is “Sunsh1ne!”. They say the 1 and the ! make it unbreakable.`,
        ask: `What do you tell them?`,
        term: `Dictionary attack`,
        options: [
          { text: `They're right, symbols make it safe`, says: `Cracking tools try these swaps automatically. It's still a dictionary word.` },
          { text: `It's a dictionary word with predictable swaps, so try a passphrase`, ok: true, says: `Spot on. Length and randomness beat clever swaps.` }
        ]
      },
      {
        title: `The sticky note`,
        story: `Your roommate keeps all their passwords on a sticky note under the keyboard.`,
        ask: `Best advice?`,
        term: `Password manager`,
        options: [
          { text: `Move it to the monitor so it's easy to find`, says: `Easier for them, and for anyone who walks by. 😅` },
          { text: `Use a password manager instead`, ok: true, says: `Yes: strong, unique passwords, and only one to remember.` },
          { text: `It's fine, nobody looks under keyboards`, says: `It's one of the first places people look.` }
        ]
      },
      {
        title: `The one password to remember`,
        story: `You start using a password manager.`,
        ask: `Which password do you still need to memorize?`,
        options: [
          { text: `The master passphrase for the manager`, ok: true, says: `Correct. Make it a strong passphrase and turn on 2FA.` },
          { text: `All of them, just in case`, says: `The manager remembers them for you. That's the whole point.` },
          { text: `None at all`, says: `You still need one: the master passphrase that unlocks the manager.` }
        ]
      },
      {
        title: `“Mother's maiden name?”`,
        story: `A website makes you pick a security question: “What is your mother's maiden name?”`,
        options: [
          { text: `Type the real answer`, says: `Real answers are often findable online or on social media.` },
          { text: `Use a made-up answer and save it in your password manager`, ok: true, says: `Pro move. Nobody can look up a fake answer.` }
        ]
      },
      {
        title: `Eyes on you`,
        story: `You're logging into your bank on a library computer and notice someone right behind you watching the screen.`,
        term: `Shoulder surfing`,
        options: [
          { text: `Keep typing, they're probably just waiting`, says: `They might be reading your password as you type.` },
          { text: `Cover the keyboard or wait until they're gone`, ok: true, says: `Yes. Shoulder surfing is low-tech but works.` }
        ]
      },
      {
        title: `“Save password?”`,
        story: `On a shared computer lab PC, the browser pops up: “Save password for student portal?”`,
        options: [
          { text: `Save it, it's convenient`, says: `The next student could log in as you.` },
          { text: `Never save on shared computers, and log out when done`, ok: true, says: `Exactly. Shared computer = save nothing.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 4. SOCIAL ENGINEERING                                            */
  /* =============================================================== */
  4: {
    funFact: `In real security tests, people carrying a clipboard or wearing a high-visibility vest are often let into buildings simply because they look like they belong.`,
    terms: [
      { term: `Social engineering`, emoji: '🧠', def: `Manipulating people, not computers, into giving access or information.` },
      { term: `Pretexting`, emoji: '📜', def: `Inventing a believable story (“I'm from IT…”) to get what you want.` },
      { term: `Baiting`, emoji: '🧀', def: `Leaving something tempting, like a USB drive labeled “Salaries”, to make people take the bait.` },
      { term: `Tailgating`, emoji: '🚪', def: `Following someone through a locked door without using your own access.` },
      { term: `Quid pro quo`, emoji: '🎁', def: `Offering a gift or help in exchange for information or access.` },
      { term: `Impersonation`, emoji: '🎭', def: `Pretending to be someone with authority: a boss, police officer, teacher or IT staff.` }
    ],
    scenarios: [
      {
        title: `The fraud “team”`,
        story: `A caller says they're from Northbridge Bank's fraud team: “Someone is spending $900 on your card. Read me the code we just texted so we can block it.”`,
        term: `Pretexting`,
        options: [
          { text: `Read them the code`, says: `That code is a login code. Reading it out lets them into your account.` },
          { text: `Hang up and call the number on the back of your card`, ok: true, says: `Perfect. Real banks never ask for codes.` },
          { text: `Ask them to prove it by reading your card number`, says: `Scammers often already have your card number. It proves nothing.` }
        ]
      },
      {
        title: `Hands full`,
        story: `A person carrying boxes asks you to hold your dorm's locked door open “because my hands are full.”`,
        term: `Tailgating`,
        options: [
          { text: `Hold the door, it's polite`, says: `That's tailgating. Laptops went missing in the real version of this story.` },
          { text: `Say: “Sorry, I can't let people in. I can call the front desk for you”`, ok: true, says: `Kind AND safe. 🙌` }
        ]
      },
      {
        title: `“EXAM ANSWERS”`,
        story: `You find a USB drive in the library labeled “EXAM ANSWERS – CHEM 101”.`,
        term: `Baiting`,
        options: [
          { text: `Plug it in, just to look`, says: `Curiosity is the bait. It may install malware the moment you plug it in.` },
          { text: `Hand it to library staff or IT without plugging it in`, ok: true, says: `Correct! Unknown USB drives are a classic trap.` },
          { text: `Plug it into a library computer instead`, says: `Now the library's computer gets infected.` }
        ]
      },
      {
        title: `$20 for 5 questions`,
        story: `A “researcher” offers you a $20 voucher to answer 5 quick questions about your workplace's computers and Wi-Fi password.`,
        term: `Quid pro quo`,
        options: [
          { text: `Answer, it's only 5 questions`, says: `$20 for the keys to your workplace network is a bad trade.` },
          { text: `Politely decline and tell your manager`, ok: true, says: `Yes. Trading information for gifts is quid pro quo.` }
        ]
      },
      {
        title: `“Hi, it's IT” 💻`,
        story: `Someone messages you on the campus chat: “Hi! I'm Alex from IT. Send me your password so I can migrate your account tonight.”`,
        term: `Impersonation`,
        options: [
          { text: `Send it, they're from IT`, says: `Real IT staff never need your password.` },
          { text: `Refuse and contact IT through the official website`, ok: true, says: `Exactly right. Verify through a channel you find yourself.` }
        ]
      },
      {
        title: `The “courier” at the door`,
        story: `A courier with a parcel asks for your student ID number and date of birth “to confirm delivery.”`,
        options: [
          { text: `Give both, it's just a delivery`, says: `Couriers need a signature or name, not your ID number and birthday.` },
          { text: `Sign your name only; ID number and birth date aren't needed`, ok: true, says: `Nice. Share only what's actually needed.` }
        ]
      },
      {
        title: `Just curious…`,
        story: `A friendly stranger at the gym asks which classes you take, your professors' names and when your dorm is empty.`,
        ask: `Why might this matter?`,
        options: [
          { text: `It doesn't, they're just chatty`, says: `Maybe! But small details add up to a convincing scam or a break-in plan.` },
          { text: `Small details help scammers build a believable story`, ok: true, says: `Right. Social engineers collect pieces like a puzzle. 🧩` }
        ]
      },
      {
        title: `“Campus Police” fine`,
        story: `An email from “Campus Police” says you have an unpaid parking fine and must pay through a link within 2 hours or be suspended.`,
        term: `Impersonation`,
        options: [
          { text: `Pay quickly, you don't want to be suspended`, says: `Authority plus urgency is the classic combo. Real fines don't work like this.` },
          { text: `Check the campus parking website yourself`, ok: true, says: `Yes! Verify through the official site, not the email.` }
        ]
      },
      {
        title: `The panicked new hire`,
        story: `At your part-time help-desk job, a caller sobs: “I'm new, my boss will fire me! Please just reset my password, I don't have my ID number.”`,
        term: `Social engineering`,
        options: [
          { text: `Reset it, they sound so stressed`, says: `Emotion is the attacker's tool. Rules exist for exactly this moment.` },
          { text: `Follow the normal identity-check process, kindly`, ok: true, says: `Kind but firm. That's the human firewall. 🛡️` }
        ]
      },
      {
        title: `The badge`,
        story: `In a café, someone with an official-looking lanyard says they're “from campus IT” and need to check your laptop for viruses right now.`,
        options: [
          { text: `Hand it over, they have a badge`, says: `Badges are easy to fake. Your laptop could be gone, or bugged, in seconds.` },
          { text: `Decline. If IT needs you, they'll contact you officially`, ok: true, says: `Exactly. Real IT doesn't ambush people in cafés.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 5. SAFE SOCIAL MEDIA HABITS                                      */
  /* =============================================================== */
  5: {
    funFact: `The background of a photo can say more than the photo itself. Street signs, house numbers, mail and keys have all helped strangers find people.`,
    terms: [
      { term: `Digital footprint`, emoji: '👣', def: `Everything about you online: posts, photos, comments, tags and accounts.` },
      { term: `Oversharing`, emoji: '📢', def: `Posting more than is safe, like your location, travel plans or personal details.` },
      { term: `Geotagging`, emoji: '📍', def: `Adding your exact location to a photo or post, sometimes automatically.` },
      { term: `Catfishing`, emoji: '🐟', def: `Using a fake identity online to trick someone, often into a relationship or scam.` },
      { term: `Cloned profile`, emoji: '👯', def: `A fake account copying a real person's name and photos to fool their friends.` },
      { term: `Doxxing`, emoji: '📂', def: `Publishing someone's private information, like their address, online without consent.` }
    ],
    scenarios: [
      {
        title: `Beach mode 🌴`,
        story: `You're about to post: “2 weeks in Mexico starting today!” with a beach selfie.`,
        term: `Oversharing`,
        options: [
          { text: `Post it now, you're excited`, says: `You've just announced your home is empty for 2 weeks.` },
          { text: `Post the photos after you're back home`, ok: true, says: `Same fun, zero risk. 😎` }
        ]
      },
      {
        title: `Your rapper name is…`,
        story: `A viral post says: “Your rapper name = your first pet + the street you grew up on! Comment yours! 🎤”`,
        options: [
          { text: `Comment yours, it's fun`, says: `You just published two common security-question answers.` },
          { text: `Skip it, those are security-question answers`, ok: true, says: `Correct! These games quietly harvest your data.` }
        ]
      },
      {
        title: `Where was this taken?`,
        story: `Your camera app automatically adds your exact location to every photo you post.`,
        term: `Geotagging`,
        options: [
          { text: `Leave it on, it's handy`, says: `Handy for strangers too: it can reveal your home or school.` },
          { text: `Turn off location for the camera and social apps`, ok: true, says: `Yes. Share places on purpose, not by accident.` }
        ]
      },
      {
        title: `Front-row flex`,
        story: `You got front-row concert tickets and want to post them.`,
        options: [
          { text: `Post the full ticket with the QR code`, says: `Anyone can copy the QR code and walk in before you.` },
          { text: `Cover the QR code and order number before posting`, ok: true, says: `Flex achieved, ticket protected. 🎫` }
        ]
      },
      {
        title: `Two of the same friend?`,
        story: `Your friend Mia, who's already on your friend list, sends a new friend request from a second account.`,
        term: `Cloned profile`,
        options: [
          { text: `Accept, it's Mia`, says: `It could be a clone that will soon ask you for money or codes.` },
          { text: `Text Mia to check before accepting`, ok: true, says: `Smart. Cloned profiles are a common trick.` }
        ]
      },
      {
        title: `The “model scout”`,
        story: `A stranger with a glamorous profile DMs: “You could be a model! Send more photos and your phone number to apply.”`,
        term: `Catfishing`,
        options: [
          { text: `Send them, it could be your big break`, says: `Fake scouts collect photos and contacts for scams or worse.` },
          { text: `Ignore and block. Real agencies have official websites`, ok: true, says: `Yes. Flattery is a classic hook.` }
        ]
      },
      {
        title: `Look behind you`,
        story: `Your new selfie looks great, but your house number and street sign are clearly visible behind you.`,
        term: `Digital footprint`,
        options: [
          { text: `Post it, nobody looks at backgrounds`, says: `Strangers do. That's your home address, in public.` },
          { text: `Crop or blur the background first`, ok: true, says: `Two seconds of editing, big privacy win. ✂️` }
        ]
      },
      {
        title: `After the argument`,
        story: `After a heated online argument, someone posts your home address and phone number in the comments.`,
        term: `Doxxing`,
        options: [
          { text: `Argue back harder`, says: `That can make things worse. Protect yourself first.` },
          { text: `Report it, lock your accounts and tell someone you trust`, ok: true, says: `Right. Doxxing is serious, and platforms will remove it.` }
        ]
      },
      {
        title: `Who can see this?`,
        story: `You notice your new posts are set to “Public” by default.`,
        options: [
          { text: `Leave it, more likes`, says: `More likes, but also more strangers seeing your life.` },
          { text: `Change the default audience to Friends`, ok: true, says: `Great. Privacy settings are your friend. 🔒` }
        ]
      },
      {
        title: `“See who stalks you!”`,
        story: `An app promises to show “who viewed your profile” if you give it full access to your account.`,
        options: [
          { text: `Allow access, you're curious`, says: `These apps can't really do that. They just grab your account and data.` },
          { text: `Deny. Social apps don't share that information`, ok: true, says: `Correct! Curiosity bait, avoided.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 6. PUBLIC WI-FI DANGERS                                          */
  /* =============================================================== */
  6: {
    funFact: `Your phone remembers Wi-Fi names and may automatically join any network with the same name. Fake “evil twin” hotspots take advantage of exactly that.`,
    terms: [
      { term: `Open network`, emoji: '🔓', def: `Wi-Fi with no password. Traffic between you and the router isn't encrypted.` },
      { term: `Evil twin`, emoji: '👿', def: `A fake hotspot copying a real network's name to trick you into joining.` },
      { term: `Attacker-in-the-middle`, emoji: '🕴️', def: `Someone secretly sitting between you and a website, reading or changing your traffic (also called “man-in-the-middle”).` },
      { term: `VPN`, emoji: '🛡️', def: `A Virtual Private Network encrypts your traffic in a private tunnel, which is great on public Wi-Fi.` },
      { term: `HTTPS`, emoji: '🔒', def: `An encrypted connection to a website (the padlock). It doesn't prove the site is honest.` },
      { term: `Captive portal`, emoji: '🚪', def: `The sign-in page some Wi-Fi networks show before you can get online.` }
    ],
    scenarios: [
      {
        title: `Airport triplets`,
        story: `The wall sign says “Free Wi-Fi: SPR-Airport-Guest”. Your phone shows: “Free_Airport_WiFi_FAST”, “SPR-Airport-Guest” and “SPR Airport Guest 2”.`,
        term: `Evil twin`,
        options: [
          { text: `Free_Airport_WiFi_FAST, it says FAST`, says: `Speed claims are bait. It isn't the official name.` },
          { text: `SPR-Airport-Guest, the exact name on the sign`, ok: true, says: `Yes! Match the official name exactly.` },
          { text: `SPR Airport Guest 2, it has the strongest signal`, says: `A strong signal can just mean the attacker is sitting near you.` }
        ]
      },
      {
        title: `Paying rent at the café`,
        story: `You need to pay rent online while sitting in a café.`,
        term: `Open network`,
        options: [
          { text: `Use the café's open Wi-Fi`, says: `Open networks are shared with strangers. Not for payments.` },
          { text: `Switch to your phone's mobile data`, ok: true, says: `Correct. Your own connection is the safest choice.` }
        ]
      },
      {
        title: `The scary warning`,
        story: `On hotel Wi-Fi, your email shows: “Your connection is not private. Attackers might be trying to steal your information.”`,
        term: `Attacker-in-the-middle`,
        options: [
          { text: `Click Advanced → Proceed anyway`, says: `That's exactly what an attacker in the middle wants you to do.` },
          { text: `Stop, disconnect and use mobile data`, ok: true, says: `Yes! Never click past that warning for logins.` }
        ]
      },
      {
        title: `Padlock = trustworthy?`,
        story: `A deal site has a padlock in the address bar. Your friend says: “See? It's safe!”`,
        term: `HTTPS`,
        options: [
          { text: `True, padlock means trustworthy`, says: `The padlock means encrypted, not honest. Scam sites get padlocks too.` },
          { text: `It only means the connection is encrypted`, ok: true, says: `Exactly. Check the domain and the deal too.` }
        ]
      },
      {
        title: `Auto-joined?!`,
        story: `Your phone auto-connected to “HotelGuest” in a city you've never visited. It remembered the name from a trip last year.`,
        options: [
          { text: `Leave auto-join on, it's convenient`, says: `That's how evil twins catch you without you noticing.` },
          { text: `Turn off auto-join and forget old networks`, ok: true, says: `Yes. Choose networks on purpose.` }
        ]
      },
      {
        title: `Sharing is… not caring`,
        story: `In the library, you notice your laptop's file sharing is ON and the network is set to “Private”.`,
        options: [
          { text: `Leave it so friends can share files`, says: `Strangers on the same network might see your files too.` },
          { text: `Set the network to “Public” and turn file sharing off`, ok: true, says: `Correct! Public mode hides your laptop from others.` }
        ]
      },
      {
        title: `VPN superpowers?`,
        story: `You're using a VPN on café Wi-Fi. A link takes you to a fake login page.`,
        ask: `Does the VPN protect your password?`,
        term: `VPN`,
        options: [
          { text: `Yes, VPNs block all attacks`, says: `A VPN protects the connection, not your choices. It delivers your password to the fake site safely. 😬` },
          { text: `No, it can't stop you typing into a phishing site`, ok: true, says: `Right. A VPN is a shield, not a brain.` }
        ]
      },
      {
        title: `“Sign in to get Wi-Fi”`,
        story: `A café's Wi-Fi page asks you to sign in with your email address AND your email password to get online.`,
        term: `Captive portal`,
        options: [
          { text: `Enter both, you need Wi-Fi`, says: `Wi-Fi never needs your email password. That's a fake portal.` },
          { text: `Don't. Ask staff or use mobile data`, ok: true, says: `Yes! A real portal might ask for an email, never its password.` }
        ]
      },
      {
        title: `Your own hotspot`,
        story: `You turn on your phone's hotspot for your laptop. It's named “Jordan's Phone” with no password.`,
        options: [
          { text: `Leave it open, it's just for a minute`, says: `Anyone nearby can join and use your data or snoop.` },
          { text: `Set a strong hotspot password`, ok: true, says: `Correct. Your hotspot, your rules. 🔐` }
        ]
      },
      {
        title: `Checking out`,
        story: `You're leaving the hotel after using its Wi-Fi all week.`,
        options: [
          { text: `“Forget” the network on your devices`, ok: true, says: `Yes. Your phone won't auto-join a fake twin with that name later.` },
          { text: `Keep it saved for next time`, says: `Saved networks can be imitated anywhere.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 7. TWO-FACTOR AUTHENTICATION                                     */
  /* =============================================================== */
  7: {
    funFact: `Passkeys let you sign in with your fingerprint or face instead of a password, and they can't be phished because they only work on the real website.`,
    terms: [
      { term: `Authentication`, emoji: '🪪', def: `Proving you are who you say you are when you log in.` },
      { term: `2FA / MFA`, emoji: '🔐', def: `Two-factor or multi-factor authentication: logging in with two or more different kinds of proof.` },
      { term: `Authenticator app`, emoji: '📱', def: `An app that shows a new 6-digit code every 30 seconds for your logins.` },
      { term: `Passkey`, emoji: '🗝️', def: `A login that uses your device and fingerprint or face. It can't be phished.` },
      { term: `SIM swapping`, emoji: '📶', def: `A scammer tricks your phone company into moving your number to their SIM to get your text codes.` },
      { term: `MFA fatigue`, emoji: '😴', def: `Spamming you with login prompts until you tap “Approve” just to make it stop.` },
      { term: `Backup codes`, emoji: '🧯', def: `One-time emergency codes to get into your account if you lose your phone.` }
    ],
    scenarios: [
      {
        title: `2FA to the rescue`,
        story: `You get an alert: “Someone entered your correct password but didn't pass 2FA. Sign-in blocked.”`,
        term: `2FA / MFA`,
        options: [
          { text: `Relax, 2FA stopped them`, says: `2FA saved you this time, but they still have your password.` },
          { text: `Change your password now`, ok: true, says: `Exactly. The first lock is broken, so replace it.` }
        ]
      },
      {
        title: `Buzz… buzz… buzz…`,
        story: `At midnight your phone shows “Approve sign-in?” fifteen times in a row. You're not logging in.`,
        term: `MFA fatigue`,
        options: [
          { text: `Approve once to make it stop`, says: `That one tap lets the attacker in. That's the whole plan.` },
          { text: `Deny every one and change your password`, ok: true, says: `Yes! Never approve what you didn't start.` }
        ]
      },
      {
        title: `A code you didn't ask for`,
        story: `This text arrives out of nowhere:`,
        visual: { type: 'sms', sender: `Verify`, number: `Text message`, text: `Your Springfield State verification code is 482913. Don't share it with anyone.` },
        ask: `What does it mean?`,
        options: [
          { text: `Someone has your password and is trying to log in`, ok: true, says: `Right. Change that password now.` },
          { text: `It's just a glitch`, says: `Codes are only sent after someone gets past the password step.` }
        ]
      },
      {
        title: `“Read me the code”`,
        story: `A minute later someone calls: “Sorry, we sent you a code by mistake. Read it to me so we can cancel it.”`,
        options: [
          { text: `Read it, they're helping`, says: `There's no such thing as “cancelling” a code by reading it out. That's the attacker.` },
          { text: `Hang up. Codes are never shared`, ok: true, says: `Perfect. That code is the last key they need.` }
        ]
      },
      {
        title: `Phone in the lake 🌊`,
        story: `Your phone with the authenticator app falls into a lake.`,
        term: `Backup codes`,
        options: [
          { text: `Use the backup codes you saved when you set up 2FA`, ok: true, says: `Exactly why backup codes exist. 🧯` },
          { text: `Make a new account`, says: `You'd lose everything. Backup codes get you back in.` }
        ]
      },
      {
        title: `“No Service”`,
        story: `Your phone suddenly shows “No Service”, and friends say your texts aren't arriving. Then you get an email about a password change you didn't make.`,
        term: `SIM swapping`,
        options: [
          { text: `Wait for the signal to come back`, says: `This looks like a SIM swap, and every minute counts.` },
          { text: `Contact your phone company immediately and secure your email`, ok: true, says: `Yes! A scammer may have moved your number to steal your codes.` }
        ]
      },
      {
        title: `Upgrade your lock`,
        story: `A site offers four 2FA options. Which is strongest?`,
        term: `Passkey`,
        options: [
          { text: `SMS text code`, says: `Better than nothing, but SIM swapping can steal it.` },
          { text: `Passkey or hardware security key`, ok: true, says: `Strongest! It only works on the real website.` },
          { text: `A security question`, says: `That's just another password, not a second factor.` }
        ]
      },
      {
        title: `App or text?`,
        story: `Your email offers 2FA by text message or by authenticator app.`,
        term: `Authenticator app`,
        options: [
          { text: `Authenticator app`, ok: true, says: `Yes. Codes live on your device, so SIM swaps can't touch them.` },
          { text: `Text message, it's easier`, says: `It works, but texts can be intercepted. The app is safer.` }
        ]
      },
      {
        title: `Which account first?`,
        story: `You have time to set up 2FA on just one account today.`,
        term: `Authentication`,
        options: [
          { text: `Your email`, ok: true, says: `Correct! Password resets for almost everything go to your email.` },
          { text: `A game you rarely play`, says: `Protect the master key first: your email.` },
          { text: `A recipe website`, says: `Your cookies are safe. 🍪 Your email matters more.` }
        ]
      },
      {
        title: `“Remember this device?”`,
        story: `Logging in on a shared library computer, you see a checkbox: “Don't ask for 2FA on this device again.”`,
        options: [
          { text: `Tick it, saves time`, says: `The next person on that computer would skip your 2FA.` },
          { text: `Leave it unticked on shared computers`, ok: true, says: `Right. Only trust devices that are yours.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 8. RECOGNIZING SCAMS                                             */
  /* =============================================================== */
  8: {
    funFact: `Scammers love gift cards because once you share the code on the back, the money can be spent within minutes and is almost impossible to get back.`,
    terms: [
      { term: `Advance-fee scam`, emoji: '💸', def: `Paying a small “fee” to unlock a big prize, grant or job that never comes.` },
      { term: `Overpayment scam`, emoji: '🧾', def: `Someone “accidentally” overpays with a fake check and asks you to send back the difference.` },
      { term: `Tech-support scam`, emoji: '🖥️', def: `Fake virus warnings that push you to call “support” and pay for fake repairs.` },
      { term: `Pig butchering`, emoji: '🐷', def: `A long fake friendship or romance that ends in a fake investment.` },
      { term: `Caller ID spoofing`, emoji: '☎️', def: `Faking the number that shows on your phone, even your bank's real number.` },
      { term: `Money mule`, emoji: '🫏', def: `Someone who moves stolen money for criminals, often without realizing it's a crime.` }
    ],
    scenarios: [
      {
        title: `Dream job, no interview`,
        story: `A recruiter DMs: “$35/hr remote assistant job! We'll mail you a $2,000 check. Deposit it and send $1,500 back for office equipment.”`,
        term: `Overpayment scam`,
        options: [
          { text: `Do it, easy money`, says: `The check bounces in a week, and you owe the bank the $1,500 you sent.` },
          { text: `Walk away. Real jobs never ask you to send money back`, ok: true, says: `Correct! That's the overpayment scam.` }
        ]
      },
      {
        title: `Sirens on screen 🚨`,
        story: `Your browser suddenly shows this, with a loud alarm:`,
        visual: { type: 'popup', title: `Security Alert`, text: `⚠ Your PC is infected with 5 viruses! Do NOT close this window. Call 1-888-555-0142 now.`, cta: `Call Support` },
        term: `Tech-support scam`,
        options: [
          { text: `Call the number`, says: `The “technician” will want remote access and $299 for fake repairs.` },
          { text: `Close the tab or browser`, ok: true, says: `Yes! Real security software never asks you to call.` }
        ]
      },
      {
        title: `Too-cheap apartment`,
        story: `A 2-bedroom near campus for $400/month (others are $1,500). The landlord is “overseas”, can't show it, and wants a deposit by wire today.`,
        options: [
          { text: `Wire the deposit before someone else does`, says: `There is no apartment. The money is gone forever.` },
          { text: `Walk away. Never pay before you've seen the place`, ok: true, says: `Correct. Classic rental scam.` }
        ]
      },
      {
        title: `You've won a grant!`,
        story: `“Congratulations! You've been awarded a $5,000 student grant. Just pay the $49 processing fee to release it.”`,
        term: `Advance-fee scam`,
        options: [
          { text: `Pay $49, it's worth it for $5,000`, says: `The $5,000 never arrives, but they'll ask for more “fees”.` },
          { text: `Ignore it. Real grants don't charge fees`, ok: true, says: `Right! Pay-to-receive is the giveaway.` }
        ]
      },
      {
        title: `My online friend's crypto app`,
        story: `Someone you've chatted with for weeks shows screenshots of huge crypto profits and invites you to their trading app.`,
        term: `Pig butchering`,
        options: [
          { text: `Try it with a small amount first`, says: `Small wins are shown on purpose. Bigger deposits can never be withdrawn.` },
          { text: `Decline and stop the conversation`, ok: true, says: `Yes. The friendship was the setup.` }
        ]
      },
      {
        title: `It's my bank's real number!`,
        story: `Your phone shows your bank's real phone number. The caller asks you to move money to a “safe account”.`,
        term: `Caller ID spoofing`,
        options: [
          { text: `Do it, it's the bank's number`, says: `Caller ID can be faked. Banks never ask you to move money to a “safe account”.` },
          { text: `Hang up and call the number on your card`, ok: true, says: `Correct. A familiar number proves nothing.` }
        ]
      },
      {
        title: `Easy 10%`,
        story: `An online “employer” asks you to receive money into your bank account and forward it to others, keeping 10%.`,
        term: `Money mule`,
        options: [
          { text: `Sure, free money`, says: `You'd be moving stolen money, and that can get YOU in legal trouble.` },
          { text: `Refuse. That's being a money mule`, ok: true, says: `Right! It's a crime, even if you didn't know.` }
        ]
      },
      {
        title: `Buyer wants a code`,
        story: `You're selling a lamp online. The buyer says: “I'll send a code to your phone to prove you're real. Tell me the code.”`,
        options: [
          { text: `Send the code, it's verification`, says: `That code lets them open an account in your phone number's name.` },
          { text: `Never share codes. Keep chatting in the app only`, ok: true, says: `Yes! Codes are for you only.` }
        ]
      },
      {
        title: `“Hi Mom” 💕`,
        story: `A new number texts: “Hi it's Mom, I dropped my phone in water. Can you send $200 in gift cards? Can't talk right now.”`,
        options: [
          { text: `Send them, it's Mom`, says: `New number + can't talk + gift cards = scam.` },
          { text: `Call Mom on her known number`, ok: true, says: `Correct! The real Mom will laugh about it.` }
        ]
      },
      {
        title: `PS5 for $150`,
        story: `You spot this listing:`,
        visual: { type: 'listing', title: `PS5 bundle + 2 controllers`, price: `$150`, text: `Brand new, sealed! Moving abroad tomorrow, must sell TODAY. Gift card or crypto only.`, seller: `Posted by “Alex_88” · account created 2 days ago` },
        options: [
          { text: `Buy it before it's gone`, says: `Too cheap, rushed, new account, untraceable payment. That's every red flag.` },
          { text: `Skip it, it's a scam`, ok: true, says: `Yes! 🚩🚩🚩🚩` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 9. PROTECTING PERSONAL INFORMATION                               */
  /* =============================================================== */
  9: {
    funFact: `Your full name, date of birth and address together can be enough for someone to try opening accounts in your name, so treat that combination like a key.`,
    terms: [
      { term: `PII`, emoji: '🪪', def: `Personally identifiable information: data that can identify you, like your name, birth date, address or SSN.` },
      { term: `Identity theft`, emoji: '🦹', def: `Someone using your personal information to open accounts or take loans in your name.` },
      { term: `Data harvesting`, emoji: '🧺', def: `Collecting lots of personal data through quizzes, surveys and “free” offers.` },
      { term: `Data broker`, emoji: '🏪', def: `A company that collects and sells information about people.` },
      { term: `Credit freeze`, emoji: '🧊', def: `Locking your credit file so nobody can open new credit in your name.` },
      { term: `App permissions`, emoji: '🎚️', def: `What an app is allowed to access: contacts, location, camera, microphone.` }
    ],
    scenarios: [
      {
        title: `The “free phone” survey`,
        story: `A survey promises a free phone. On the last page it asks for your full name, date of birth, address and phone number.`,
        term: `Data harvesting`,
        options: [
          { text: `Fill it in, free phone!`, says: `There's no phone, just a stranger with your identity details.` },
          { text: `Close it. No giveaway needs that combination`, ok: true, says: `Correct! That's data harvesting.` }
        ]
      },
      {
        title: `Library walk-away`,
        story: `You finish checking email on a library computer and need to rush to class.`,
        options: [
          { text: `Just close the browser window`, says: `Some sites stay logged in. The next person could open your email.` },
          { text: `Log out properly first`, ok: true, says: `Yes! Ten seconds that protect your whole account.` }
        ]
      },
      {
        title: `Who gets your SSN?`,
        story: `Four requests for your Social Security number. Which is normal?`,
        term: `PII`,
        options: [
          { text: `A free T-shirt website`, says: `Never. A T-shirt doesn't need your SSN.` },
          { text: `Your new job's official HR system, for tax forms`, ok: true, says: `Right. Employers need it for taxes, through official channels.` },
          { text: `A text from “the IRS”`, says: `Government agencies don't text you asking for your SSN.` }
        ]
      },
      {
        title: `Selling your old phone`,
        story: `You're selling your old phone online.`,
        options: [
          { text: `Delete your photos and hand it over`, says: `Accounts, messages and saved passwords are still on it.` },
          { text: `Back up, sign out of everything, remove the SIM, factory reset`, ok: true, says: `Perfect. A clean phone, a clean conscience. 📱` }
        ]
      },
      {
        title: `You're on a website?!`,
        story: `You search your name and find a “people search” site listing your phone number and address.`,
        term: `Data broker`,
        options: [
          { text: `Ignore it, nothing you can do`, says: `You can! Most sites have an opt-out or removal page.` },
          { text: `Use the site's opt-out or removal request`, ok: true, says: `Yes. Data brokers must remove you when asked in many places.` }
        ]
      },
      {
        title: `A card you never opened`,
        story: `A letter says a new credit card was opened in your name. You never applied.`,
        term: `Identity theft`,
        options: [
          { text: `Call the number in the letter right away`, says: `The letter could be part of the scam. Look up the official number yourself.` },
          { text: `Report it via the card company's official number and freeze your credit`, ok: true, says: `Correct! A credit freeze stops more accounts being opened.` }
        ]
      },
      {
        title: `Freeze it! 🧊`,
        story: `You're not planning to apply for any loans or credit cards this year.`,
        ask: `What protects you most from new accounts in your name?`,
        term: `Credit freeze`,
        options: [
          { text: `A credit freeze`, ok: true, says: `Yes. It's free, and you can unfreeze it any time you need credit.` },
          { text: `Changing your email password`, says: `Good habit, but it doesn't stop new credit accounts.` }
        ]
      },
      {
        title: `Nosy flashlight`,
        story: `A flashlight app asks for access to your contacts, location and microphone.`,
        term: `App permissions`,
        options: [
          { text: `Allow all, it's just a flashlight`, says: `Exactly: a flashlight doesn't need any of that. It's collecting your data.` },
          { text: `Deny, and maybe delete the app`, ok: true, says: `Right! Give apps only what they need.` }
        ]
      },
      {
        title: `Old bank letters`,
        story: `You have a pile of old bank statements and medical letters.`,
        options: [
          { text: `Shred them`, ok: true, says: `Yes. Paper PII is still PII.` },
          { text: `Toss them in the recycling`, says: `Anyone can pull them out of the bin.` }
        ]
      },
      {
        title: `Delete = gone?`,
        story: `You posted something you regret and deleted it after an hour.`,
        ask: `Is it gone forever?`,
        options: [
          { text: `Yes, deleted means gone`, says: `Screenshots, shares and archives might keep it alive.` },
          { text: `Not necessarily, someone may have saved it`, ok: true, says: `Correct. Think before posting, not after.` }
        ]
      }
    ]
  },

  /* =============================================================== */
  /* 10. MALWARE & RANSOMWARE                                         */
  /* =============================================================== */
  10: {
    funFact: `The first PC virus that spread widely, “Brain” (1986), included its creators' names, address and phone number. Modern malware authors are much sneakier.`,
    terms: [
      { term: `Malware`, emoji: '🦠', def: `Malicious software: any program designed to harm, spy on or take over your device.` },
      { term: `Ransomware`, emoji: '🔒', def: `Malware that locks or encrypts your files and demands payment to unlock them.` },
      { term: `Trojan horse`, emoji: '🐴', def: `Malware disguised as something useful, like a free game or “cracked” app.` },
      { term: `Spyware`, emoji: '🕵️', def: `Malware that secretly watches what you do and steals information.` },
      { term: `Keylogger`, emoji: '⌨️', def: `Spyware that records every key you type, including passwords.` },
      { term: `Worm`, emoji: '🪱', def: `Malware that copies itself from computer to computer on its own.` },
      { term: `Botnet`, emoji: '🤖', def: `An army of infected devices controlled by criminals, often used for attacks.` },
      { term: `Patch`, emoji: '🩹', def: `A software update that fixes a security hole.` }
    ],
    scenarios: [
      {
        title: `“Free” premium game`,
        story: `A forum offers “Galaxy Raiders PREMIUM – cracked, 100% free!” as a download.`,
        term: `Trojan horse`,
        options: [
          { text: `Download it, free is free`, says: `Cracked software is a favorite hiding spot for malware.` },
          { text: `Skip it and get games from official stores`, ok: true, says: `Yes! That “free” game could cost you your accounts.` }
        ]
      },
      {
        title: `The ransom note`,
        story: `Your screen turns red: “All your files are encrypted. Pay 0.1 Bitcoin within 48 hours or lose them forever.”`,
        term: `Ransomware`,
        options: [
          { text: `Pay quickly to get your files back`, says: `Paying funds crime, and often doesn't even work.` },
          { text: `Disconnect from Wi-Fi, tell IT or a trusted adult, restore from backup`, ok: true, says: `Correct. Stop the spread, get help, restore.` },
          { text: `Keep restarting until it goes away`, says: `It won't go away, and it may spread while connected.` }
        ]
      },
      {
        title: `Slow, hot and weird`,
        story: `Your laptop is suddenly slow, the fan is loud all the time, and strange ads pop up even with no browser open.`,
        term: `Malware`,
        options: [
          { text: `Ignore it, laptops get old`, says: `These are classic infection signs.` },
          { text: `Run a full antivirus scan and update everything`, ok: true, says: `Yes! Scan first, then patch.` }
        ]
      },
      {
        title: `The café computer`,
        story: `The day after you logged in on an internet-café computer, someone else logs into your account.`,
        term: `Keylogger`,
        options: [
          { text: `Change your password from your own device and turn on 2FA`, ok: true, says: `Right. That computer may have had a keylogger.` },
          { text: `Change it from the same café computer`, says: `If there's a keylogger, it records your new password too!` }
        ]
      },
      {
        title: `Update available`,
        story: `This notification appears from your laptop's built-in settings:`,
        visual: { type: 'notification', app: `System Settings`, text: `Security update available. Restart tonight to install.` },
        term: `Patch`,
        options: [
          { text: `Install it tonight`, ok: true, says: `Yes! Patches close the holes malware uses.` },
          { text: `Postpone for months`, says: `Every day unpatched is a day attackers can use known holes.` }
        ]
      },
      {
        title: `“Your player is outdated”`,
        story: `While streaming a free movie site, this pops up:`,
        visual: { type: 'popup', title: `Video Player Update Required`, text: `Your video player is out of date. Download the update to keep watching.`, cta: `Download update` },
        options: [
          { text: `Download the update`, says: `Fake updates are a top way to deliver malware.` },
          { text: `Close it. Real updates come from your device's settings or app store`, ok: true, says: `Correct! Never update from a random pop-up.` }
        ]
      },
      {
        title: `Backup plan`,
        story: `You want to protect your photos and essays from ransomware.`,
        ask: `Which backup is best?`,
        options: [
          { text: `A copy in another folder on the same laptop`, says: `Ransomware encrypts that copy too.` },
          { text: `A USB drive that's always plugged in`, says: `If it's always connected, ransomware can lock it too.` },
          { text: `Cloud backup with version history, plus a drive you unplug`, ok: true, says: `Yes! At least one copy that ransomware can't reach.` }
        ]
      },
      {
        title: `It spreads by itself`,
        story: `Malware infects one unpatched computer in a dorm, then copies itself to every other unpatched computer on the network, without anyone clicking anything.`,
        ask: `What type is this?`,
        term: `Worm`,
        options: [
          { text: `A worm`, ok: true, says: `Correct! Worms spread on their own, so patching matters.` },
          { text: `A trojan horse`, says: `Trojans need you to install them. This one spreads itself.` }
        ]
      },
      {
        title: `Your camera, the criminal`,
        story: `You learn your cheap smart camera, still using the default password “admin”, has been helping attack websites.`,
        term: `Botnet`,
        options: [
          { text: `Change the default password and update its firmware`, ok: true, says: `Yes! Default passwords build botnets.` },
          { text: `It's fine, nothing was stolen from you`, says: `Your device is part of a criminal botnet. Secure it!` }
        ]
      },
      {
        title: `“Free premium music” APK`,
        story: `A website offers a modified music app with “free premium forever”. You'd have to install it from outside the official app store.`,
        term: `Spyware`,
        options: [
          { text: `Install it`, says: `Modified apps often carry spyware that reads your messages and passwords.` },
          { text: `Stick to the official app store`, ok: true, says: `Correct! Free premium isn't worth your privacy.` }
        ]
      }
    ]
  }
};

/** Every term from every lesson, A–Z (used by the glossary on the Help page). */
export const ALL_TERMS = Object.entries(LESSON_EXTRAS)
  .flatMap(([lessonId, extras]) => (extras.terms || []).map(t => ({ ...t, lessonId: Number(lessonId) })))
  .sort((a, b) => a.term.localeCompare(b.term));
