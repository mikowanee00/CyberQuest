/* =====================================================================
 * data/lessonExtras.js — Extra content for every lesson
 * ---------------------------------------------------------------------
 *   funFact   a short "Did you know?" fact
 *   examples  real-life stories: what happened, red flags, what to do
 *   practice  ungraded "Quick check" questions (players can retry)
 *
 * Kept in its own file so lessons.js does not need to change.
 * Every person, company and message here is made up.
 * ===================================================================== */

export const LESSON_EXTRAS = {
  /* ---------------- 1. What Is Phishing? ---------------- */
  1: {
    funFact: `The “ph” in phishing is a nod to early hackers called “phone phreakers”, who tricked telephone systems long before email existed.`,
    examples: [
      {
        title: `The “mailbox full” scare`,
        story: `Priya gets an email: “Your university mailbox is 99% full. Upgrade within 24 hours or new messages will bounce.” The link opens a page that looks exactly like her school login, so she types her password. An hour later, her account is sending the same email to all her classmates.`,
        flags: [`A deadline designed to make her panic`, `A link that leads to a login page`, `The sender wasn't the university's real address`],
        fix: `Check your storage by opening the student portal yourself, never through the email link. If you already typed your password, change it right away and tell IT.`
      },
      {
        title: `“Is this you in this video?”`,
        story: `Marcus gets a direct message from his friend's account: “omg is this you in this video?? 😳” with a link. The page asks him to log in to see the video. His friend's account had been hacked, and now his is too.`,
        flags: [`Curiosity bait (“is this you?”)`, `A login request just to view something`, `The message didn't sound like his friend`],
        fix: `Ask your friend through a different app or a phone call before clicking. Never log in from a link someone sends you.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `Which of these is a phishing attempt?`,
        options: [
          `A notification in your banking app about a purchase you just made`,
          `An email asking you to reply with your password to “confirm your account”`,
          `A calendar reminder you created yourself`
        ],
        answer: 1,
        explain: `No real company asks for your password by email. That request alone is enough to know it's phishing.`
      },
      {
        type: 'mcq',
        prompt: `A message makes you panic and want to act immediately. What's the best first move?`,
        options: [`Act fast before it's too late`, `Pause and check it in the official app or website`, `Forward it to everyone you know`],
        answer: 1,
        explain: `Panic is the attacker's tool. Pausing for a minute and checking through a trusted route beats almost every scam.`
      },
      {
        type: 'tf',
        prompt: `Phishing messages always have spelling mistakes, so a well-written message is safe.`,
        answer: false,
        explain: `Many phishing messages are perfectly written. Judge the request (password, payment, urgent link), not the spelling.`
      }
    ]
  },

  /* ---------------- 2. Spot the Fake Email ---------------- */
  2: {
    funFact: `Scammers register look-alike web addresses. Swapping “m” for “rn” is a classic: at a glance, “strearnly.com” reads like “streamly.com”.`,
    examples: [
      {
        title: `The $2.99 “redelivery fee”`,
        story: `Leo receives an email from “ParcelPost” saying his package is on hold until he pays a $2.99 redelivery fee. He isn't expecting anything, but it's only $2.99… The payment page saves his card details, and a week later there are $640 of charges he didn't make.`,
        flags: [`He wasn't expecting a package`, `The sender address was parcelpost-delivery-help.com, not the real site`, `A tiny fee to make paying feel harmless`],
        fix: `Track parcels only in the delivery company's official app, or by typing its address yourself. If you entered card details, call your bank and block the card.`
      },
      {
        title: `The “overdue invoice” attachment`,
        story: `An office assistant gets “Invoice #4471 OVERDUE — see attached” from a company she has never heard of. The attachment is called Invoice_4471.zip. Opening it locks every file on the shared drive and shows a ransom message.`,
        flags: [`An unknown sender`, `A .zip attachment nobody asked for`, `Pressure in capital letters`],
        fix: `Don't open unexpected attachments. Check with the finance team using a contact you already know, and report the email to IT.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `A link says “northbridge.com/login”, but hovering shows “http://northbridge.com.secure-update.biz/login”. Is it safe?`,
        options: [`Safe — it starts with northbridge.com`, `Not safe — the real domain is secure-update.biz`],
        answer: 1,
        explain: `The real domain is the part just before the first single “/”: secure-update.biz. “northbridge.com” is only a decoy at the front.`
      },
      {
        type: 'mcq',
        prompt: `Which sender is most likely the real Springfield State University?`,
        options: [`it-support@springfieldstate.edu`, `it-support@springfieldstate-edu.com`, `springfieldstate.it.support@freemail.com`],
        answer: 0,
        explain: `Only the first one uses the university's own .edu domain. The others are look-alikes or free email accounts.`
      },
      {
        type: 'mcq',
        prompt: `Which attachment from an unknown sender is the most dangerous to open?`,
        options: [`holiday-photo.jpg`, `schedule.pdf.exe`, `notes.txt`],
        answer: 1,
        explain: `“.pdf.exe” is a program pretending to be a PDF. The real file type is the last part: .exe.`
      }
    ]
  },

  /* ---------------- 3. Strong vs. Weak Passwords ---------------- */
  3: {
    funFact: `A four-word passphrase like “violin-cactus-orbit-pancake” is longer than most passwords, yet easier to remember because your brain can picture it.`,
    examples: [
      {
        title: `One leak, five accounts`,
        story: `Jordan used the same password for a gaming site, his email and his bank. The gaming site was hacked and its passwords were posted online. Attackers tried Jordan's email and password everywhere, got into his email, and used “forgot password” to take over his other accounts.`,
        flagsTitle: `What went wrong`,
        flags: [`The same password on every site`, `No two-factor authentication on his email`],
        fix: `Use a different password for every account (a password manager makes this easy) and turn on 2FA, starting with your email.`
      },
      {
        title: `The password anyone could guess`,
        story: `Aisha's password was her dog's name plus her birth year: “Bella2005”. Both were on her public profile. Someone guessed it in three tries and posted embarrassing messages from her account.`,
        flagsTitle: `What went wrong`,
        flags: [`Personal details that are easy to find online`, `A short, predictable pattern (word + year)`],
        fix: `Use random words that have nothing to do with you, like a generated passphrase.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `Which change makes the password “sunshine” the MOST secure?`,
        options: [`Sunshine1`, `sunshine!`, `sunshine-tractor-velvet-comet`],
        answer: 2,
        explain: `Adding one character barely helps. Adding random words makes it much longer, and length is what slows attackers down.`
      },
      {
        type: 'tf',
        prompt: `Writing your password on a sticky note on your laptop is fine as long as it's a strong password.`,
        answer: false,
        explain: `Anyone who sees the laptop sees the password. A password manager is the safe way to remember it.`
      },
      {
        type: 'mcq',
        prompt: `A website you use announces it was hacked. What should you change?`,
        options: [`Nothing — it's their problem`, `That site's password, plus any other account that used the same one`, `Only your profile picture`],
        answer: 1,
        explain: `Attackers will try the leaked password on other sites, so every account that shares it is at risk.`
      }
    ]
  },

  /* ---------------- 4. Social Engineering ---------------- */
  4: {
    funFact: `In real security tests, people carrying a clipboard or wearing a high-visibility vest are often let into buildings simply because they look like they belong.`,
    examples: [
      {
        title: `The urgent call from “the bank”`,
        story: `Sofia's phone rings: “This is Northbridge Bank's fraud team. Someone is trying to spend $900 on your card. To block it, read me the code we just texted you.” She reads the code. It was a login code, and the caller is now inside her account.`,
        flags: [`An unexpected call creating fear`, `A request for a code sent to her phone`, `Pressure to act during the call`],
        fix: `Hang up and call the number printed on the back of your card. A real bank will never ask you to read out a code.`
      },
      {
        title: `The helpful stranger at the door`,
        story: `A person carrying a stack of boxes asks a student to hold the dorm's locked door open “because my hands are full.” The student holds it. The stranger wasn't a resident, and two laptops disappear from the lounge that afternoon.`,
        flags: [`Using politeness to get through a locked door`, `No key card shown`],
        fix: `It's OK to say “Sorry, I can't let people in — I can call the front desk for you.”`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `Someone calls saying they're from IT and asks for your password to “fix your account”. What do you do?`,
        options: [`Give it — they're from IT`, `Refuse, hang up and contact IT using the official number`, `Give them half of it`],
        answer: 1,
        explain: `Real IT staff never need your password. Contact them through a number or website you find yourself.`
      },
      {
        type: 'mcq',
        prompt: `“Only 2 spots left in this scholarship — apply in the next 10 minutes!” Which trick is this?`,
        options: [`Scarcity and urgency`, `Authority`, `Friendliness`],
        answer: 0,
        explain: `“Only 2 left” is scarcity, and “10 minutes” is urgency. Together they rush you into acting without thinking.`
      },
      {
        type: 'tf',
        prompt: `Checking who someone really is would be rude, so it's better to just trust them.`,
        answer: false,
        explain: `Verifying is normal and smart. Genuine people won't mind, and scammers usually give up.`
      }
    ]
  },

  /* ---------------- 5. Safe Social Media Habits ---------------- */
  5: {
    funFact: `The background of a photo can say more than the photo itself. Street signs, house numbers, mail and keys have all helped strangers find people.`,
    examples: [
      {
        title: `The live vacation post`,
        story: `Daniel posts beach photos every day with “2 weeks in Mexico 🌴”. An older post had shown his front door and house number. While he's away, someone breaks into his apartment.`,
        flags: [`Posting live while away from home`, `Older posts revealed where he lives`],
        fix: `Share trip photos after you get home, and turn off precise location on your camera and apps.`
      },
      {
        title: `The “fun” name quiz`,
        story: `A viral post says: “Your rapper name = your first pet + the street you grew up on!” Hundreds of people reply with their answers. Those are two of the most common security questions for resetting passwords.`,
        flags: [`It asks for typical security-question answers`, `Everyone answers in public`],
        fix: `Skip these quizzes. For security questions, use made-up answers stored in your password manager.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `Which of these is the riskiest to post publicly?`,
        options: [`Your favorite pizza topping`, `A photo of your new car keys with your house number visible behind them`, `A meme you liked`],
        answer: 1,
        explain: `Keys plus a house number tell a stranger what to steal and where to find it.`
      },
      {
        type: 'mcq',
        prompt: `A stranger with no mutual friends sends you a friend request. What's the best choice?`,
        options: [`Accept`, `Ignore or decline it`, `Accept and send your phone number`],
        answer: 1,
        explain: `Brand-new accounts with no connections are often fake profiles collecting information.`
      },
      {
        type: 'tf',
        prompt: `Turning off precise location for your camera and social apps helps protect your privacy.`,
        answer: true,
        explain: `Photos can carry hidden location data. Turning it off stops you from accidentally sharing where you live.`
      }
    ]
  },

  /* ---------------- 6. Public Wi-Fi Dangers ---------------- */
  6: {
    funFact: `Your phone remembers Wi-Fi names and may automatically join any network with the same name. Fake “evil twin” hotspots take advantage of exactly that.`,
    examples: [
      {
        title: `The airport hotspot`,
        story: `Waiting for her flight, Mia joins “Airport_Free_WiFi”. A page asks her to sign in with her email account to get online. It's a fake page run by someone sitting nearby, and they now have her email password.`,
        flags: [`An open network with a generic name`, `A sign-in page asking for her email password`],
        fix: `Ask staff for the exact network name, and use mobile data for anything that needs a login.`
      },
      {
        title: `Banking in the hotel lobby`,
        story: `Ken checks his bank account on the hotel's open Wi-Fi. Someone on the same network has set up a fake copy of the bank's login page. Ken doesn't notice the slightly different address and types his details.`,
        flags: [`Banking on an open, shared network`, `He didn't check the address bar`],
        fix: `Use your phone's mobile data or a trusted VPN for banking, and always check the web address before logging in.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `You need to pay a bill while sitting in a café. What's the safest option?`,
        options: [`The café's open Wi-Fi`, `Your phone's mobile data`, `Any network with “Free” in its name`],
        answer: 1,
        explain: `Your own mobile connection isn't shared with strangers, so it's the safest choice for payments.`
      },
      {
        type: 'mcq',
        prompt: `Two networks appear: “CampusCafe” (password) and “CampusCafe-FREE” (open). Staff say the Wi-Fi is “CampusCafe”. Which do you join?`,
        options: [`CampusCafe`, `CampusCafe-FREE`],
        answer: 0,
        explain: `Join the exact name staff gave you. A look-alike open network is a classic evil twin.`
      },
      {
        type: 'tf',
        prompt: `A VPN encrypts your internet traffic on public Wi-Fi so others on the network can't read it.`,
        answer: true,
        explain: `That's exactly what a VPN does. It doesn't make you invisible, but it protects you on shared networks.`
      }
    ]
  },

  /* ---------------- 7. Two-Factor Authentication ---------------- */
  7: {
    funFact: `Passkeys let you sign in with your fingerprint or face instead of a password, and they can't be phished because they only work on the real website.`,
    examples: [
      {
        title: `2FA saves the day`,
        story: `Hannah's password was leaked in a data breach. An attacker typed it in correctly, then got stuck: the site asked for the 6-digit code from her authenticator app. Hannah got a “new sign-in attempt” alert and changed her password. Nothing was lost.`,
        flagsTitle: `What went right`,
        flags: [`She had 2FA turned on`, `She acted on the alert straight away`],
        fix: `Turn on 2FA for your email, school, bank and social media accounts. It takes two minutes per account.`
      },
      {
        title: `The midnight approval spam`,
        story: `Raj's phone buzzes with “Approve sign-in?” fifteen times at midnight. Tired and annoyed, he taps Approve just to make it stop. That one tap lets the attacker into his account.`,
        flags: [`Login requests he didn't start`, `So many prompts that he gave in`],
        fix: `Never approve a sign-in you didn't start. Tap Deny, change your password, and report it if it's a school or work account.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `Which pair is real two-factor authentication?`,
        options: [`Password + PIN`, `Password + fingerprint`, `Two different passwords`],
        answer: 1,
        explain: `A password is something you know and a fingerprint is something you are: two different factor types.`
      },
      {
        type: 'mcq',
        prompt: `You lost the phone that has your authenticator app. What gets you back into your accounts?`,
        options: [`The backup codes you saved earlier`, `Guessing the code`, `Creating a new email address`],
        answer: 0,
        explain: `Backup codes are your emergency key. Save them somewhere safe when you set up 2FA.`
      },
      {
        type: 'tf',
        prompt: `If you didn't try to log in, you should deny a login approval request.`,
        answer: true,
        explain: `An unexpected request means someone else has your password. Deny it and change the password.`
      }
    ]
  },

  /* ---------------- 8. Recognizing Scams ---------------- */
  8: {
    funFact: `Scammers love gift cards because once you share the code on the back, the money can be spent within minutes and is almost impossible to get back.`,
    examples: [
      {
        title: `The dream remote job`,
        story: `Nina is offered $35 an hour as a remote assistant, with no interview. They mail her a $2,000 check, ask her to deposit it, and send $1,500 back for “office equipment”. A week later the check bounces, and Nina owes her bank $1,500.`,
        flags: [`High pay with no interview`, `A check to deposit and money to send back`, `A job offer through direct messages`],
        fix: `Real employers never ask you to send money back. Look up the company yourself and apply through its official website.`
      },
      {
        title: `The scary pop-up`,
        story: `While browsing, Omar's screen fills with a flashing warning and a loud alarm: “Your PC is infected! Call 1-888-555-0142 now!” The “technician” asks for remote access to his computer and charges $299 for fake repairs.`,
        flags: [`A pop-up with a phone number`, `Alarms and countdowns to create panic`, `A request for remote access and payment`],
        fix: `Close the browser tab (or the whole browser). Real security software never asks you to call a number.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `Which payment request is the biggest scam red flag?`,
        options: [`Pay with gift cards`, `Pay by card on the store's official website`, `Pay at the store counter`],
        answer: 0,
        explain: `No real business or government office asks to be paid in gift cards.`
      },
      {
        type: 'mcq',
        prompt: `An apartment is half the usual price. The landlord can't show it but wants a deposit by wire transfer today. What do you do?`,
        options: [`Send the deposit quickly before someone else does`, `Walk away — never pay before you've seen a place`, `Send half now`],
        answer: 1,
        explain: `Too cheap, can't be viewed, and urgent wire payment: that's the classic rental scam.`
      },
      {
        type: 'tf',
        prompt: `If you've been scammed, it's best to keep it to yourself.`,
        answer: false,
        explain: `Tell your bank and report it quickly. Fast action can stop payments, and reporting protects others.`
      }
    ]
  },

  /* ---------------- 9. Protecting Personal Information ---------------- */
  9: {
    funFact: `Your full name, date of birth and address together can be enough for someone to try opening accounts in your name, so treat that combination like a key.`,
    examples: [
      {
        title: `The “free phone” survey`,
        story: `A website promises a free phone for finishing a short survey. At the end it asks for Leah's full name, date of birth, address and phone number. A few weeks later, letters arrive about loans she never applied for.`,
        flags: [`A prize that's too good to be true`, `A survey asking for her full identity`],
        fix: `No real giveaway needs your date of birth and address. Close the page, and if you already shared details, contact your bank.`
      },
      {
        title: `The library computer`,
        story: `Carlos checks his email on a library computer and walks away without logging out. The next person reads his messages and uses “forgot password” to take over his social media account.`,
        flagsTitle: `What went wrong`,
        flags: [`He stayed logged in on a shared computer`],
        fix: `Always log out on shared computers, and use a private browsing window when you can.`
      }
    ],
    practice: [
      {
        type: 'mcq',
        prompt: `Which of these is OK to share on a public profile?`,
        options: [`Your favorite band`, `Your home address`, `Your full date of birth`],
        answer: 0,
        explain: `A favorite band doesn't identify you. Your address and birth date are useful to identity thieves.`
      },
      {
        type: 'mcq',
        prompt: `A website you've never heard of asks for your Social Security number to give you a discount code. What do you do?`,
        options: [`Enter it`, `Close the site`, `Enter a friend's number instead`],
        answer: 1,
        explain: `A discount never needs your SSN. This is a data-harvesting trick.`
      },
      {
        type: 'tf',
        prompt: `Installing updates on your phone and laptop helps protect your personal data.`,
        answer: true,
        explain: `Updates fix security holes that attackers use to get into devices.`
      }
    ]
  },

  /* ---------------- 10. Final Challenge ---------------- */
  10: {
    funFact: `Most scams follow the same three steps: a strong emotion, a tight deadline, and a request that's hard to undo. Spot the pattern and you can spot almost any scam.`,
    examples: [],
    practice: [
      {
        type: 'mcq',
        prompt: `Warm-up: what should you do before clicking a link in an email?`,
        options: [`Hover over it (or long-press) to see the real address`, `Click quickly before it expires`, `Reply and ask if it's safe`],
        answer: 0,
        explain: `Checking the real destination takes two seconds and catches most fake links.`
      },
      {
        type: 'mcq',
        prompt: `Warm-up: which combination best protects an account?`,
        options: [`A unique passphrase + two-factor authentication`, `A short password + no 2FA`, `The same strong password everywhere`],
        answer: 0,
        explain: `Unique and long stops leaks spreading between sites, and 2FA blocks stolen passwords.`
      },
      {
        type: 'tf',
        prompt: `Warm-up: real companies sometimes ask customers to pay with gift cards.`,
        answer: false,
        explain: `Gift-card payment requests are always a scam.`
      }
    ]
  }
};
