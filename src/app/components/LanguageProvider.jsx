"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Navigation & General
    home: "Home",
    about: "About",
    sessions: "Sessions",
    blog: "Blog",
    contact: "Contact",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    admin: "Admin",
    purchase: "Purchase",

    // Categories
    body_confidence: "Body Confidence",
    self_love: "Self-Love",
    emotional_healing: "Emotional Healing",
    freedom_path: "Freedom Path",
    restful_nights: "Restful Nights",
    bright_minds: "Bright Minds",
    book_your_sessions: "Book Your Sessions",
    watch_video: "Watch Video",
    follow_us: "Follow Us",
    // Taglines & Headers
    heal_tagline: "Heal your soul with us.",
    brand_name: "Subconscious Valley",

    // Homepage
    hero_title:
      "Train your subconscious today. It already runs your breathing and most of your daily choices. Our science-backed hypnotherapy and NLP audios quietly reprogram the subconscious mind while you relax.",
    hero_sub_title_1:
      "No calls or waitlists. Purchase, press play, and stream.",
    hero_sub_title_2:
      "Deliberately install better defaults: Calm, Clarity, and Consistent action. Start now and let therapy do the heavy lifting.",
    hero_title_1: "The Power to Rewrite",
    hero_title_2: "Your Story",
    hero_subtitle:
      "Because lasting change begins where your mind truly listens - deep in the subconscious.",
    multilingual_support_desc:
      "Multilingual NLP & Hypnotherapy Audios for Deep, Lasting Change",
    start_your_transformation: "Start Your Transformation",
    explore_programs: "Explore Programs",
    get_in_touch: "Get in Touch",
    video_welcome: "Welcome to Subconscious Valley",
    video_discover: "Meet Vanita Pande & discover your transformation",
    meet_vanita: "Meet Vanita Pande",
    founder_intro_quote:
      "Welcome to Subconscious Valley - where powerful NLP and hypnotherapy sessions meet real-life transformation. I created this brand to bring you a new way of healing - one that works with your subconscious mind to break old patterns and build a stronger, happier you.",
    founder_intro_p1:
      "I'm Vanita Pande, a certified NLP and hypnotherapy practitioner with years of experience in guiding people through emotional, mental, and behavioral transformations. My work is focused on creating practical, accessible tools that help people heal from within, gain control over their habits, and live with more clarity, confidence, and joy.",
    founder_intro_p2:
      "For the first time, multilingual Asian healing audios are designed to speak to your heart and mind at the same time. This is not just self-help - this is your turning point.",
    science_based: "Science-Based",
    science_based_desc: "NLP & hypnotherapy backed by research",
    read_full_story: "Read My Full Story",
    transformation_stories: "Transformation Stories",
    transformation_stories_desc:
      "Real people, real results. See how Subconscious Valley has helped others break through barriers and create lasting change.",
    verified: "Verified",
    our_collections: "Our Transformation Collections",
    our_collections_desc:
      "Carefully crafted programs that address real challenges - from anxiety and trauma to weight loss and self-esteem. Each session is designed with precision.",
    explore_collection: "Explore Collection",
    view_all_sessions: "View All Sessions",
    ready_to_start: "Ready to Start Your Journey?",
    ready_to_start_desc:
      "Have questions about our sessions or need personalized guidance? We're here to support you every step of the way.",
    visit_us: "Visit Us",
    email_us: "Email Us",
    whatsapp: "WhatsApp",
    send_us_message: "Send us a Message",
    multilingual_support: "Multilingual Support",
    multilingual_support_contact_desc:
      "We communicate in English, Hindi, and Arabic",
    personal_consultation: "Personal Consultation",
    personal_consultation_desc: "Free 15-minute discovery calls available",
    contact_us_now: "Contact Us Now",
    final_cta_title: "Your Transformation Begins Today",
    final_cta_desc:
      "Join thousands who have already started their healing journey with Subconscious Valley.",
    browse_sessions: "Browse Sessions",
    get_started: "Get Started",

    // Testimonials (Placeholders)
    testimonial_1:
      "The weight loss sessions completely changed my relationship with food. I've lost 15kg and feel amazing!",
    testimonial_2:
      "The anxiety sessions in Arabic helped me in ways traditional therapy couldn't. I'm finally at peace.",
    testimonial_3:
      "Self-love sessions in Hindi touched my heart deeply. I now speak to myself with kindness.",

    //co-founer
    co_founder: "Co Founder",
    about_cofounder:
      "Sara, 15, is a certified Access Bars Practitioner with a strong interest in energy healing and consciousness work. She's contributed meaningfully to SubconsciousValley's audio content shaping its calming feel through solid technical input, aesthetic sense, and sensitivity to the emotional/energetic impact of sound. As a young creator, she embodies the brand's belief that healing, awareness, and creativity aren't limited by age.",
    meet_cofounder: "Meet Sara",
    young_visionary: "Young Visionary",
    // About Page
    about_hero_title: "Healing That Speaks",
    about_hero_title_2: "to Your Subconscious",
    about_hero_desc:
      "True change sticks when you reprogram the subconscious mindmthe layer that drives habits, emotions, and automatic decisions. Subconscious Valley delivers science based hypnotherapy, NLP, and guided audio sessions that install calmer defaults, stronger focus, and consistent action.",
    story_behind_title: "The Story Behind Subconscious Valley",
    story_behind_desc: "Every transformation begins with a story. Here's mine.",
    founder_about_quote:
      "I believe that every person carries within them the power to heal, transform, and create the life they truly desire. Sometimes, we just need the right key to unlock that power - and that key is often found in the language of our heart.",
    why_multilingual_matters: "Why Multilingual Matters",
    why_multilingual_p1:
      "Breakthroughs happen faster when subconscious reprogramming speaks your mother tongue. Working across the Middle East and Asia, we saw clients unlock emotions and resolve blocks the moment sessions switched to Arabic, Hindi, or their native language.",
    why_multilingual_p2:
      "Multilingual hypnotherapy + NLP connects cultural beliefs with modern neuroscience and therapy, making guided meditations and brainwave-entrainment audio more effective and more personal.",
    founder_title: "Founder & Lead Practitioner",
    certifications_training: "Certifications & Training",
    lives_transformed: "Lives Transformed",
    across_countries: "Across multiple languages and 15+ countries",
    languages_we_heal_in: "Languages We Heal In",
    many_more: "Many more...",
    awards_recognition: "Awards & Recognition",
    awards_desc:"Subconscious Valley proudly stands as a globally recognized name in the wellness industry. Its founder, Vanita Pande, has been honored with the Professional Excellence Awards for Global Wellness Innovation 2025, celebrating her outstanding contribution to transforming the way people experience emotional and mental well-being.",
    awards_desc_2:"Her groundbreaking innovation introduced audio-based therapy experiences that bring healing directly to individuals anytime, anywhere in a deeply personal and accessible way. As a pioneer in offering therapies in multiple Asian languages, Vanita ensured that emotional wellness transcends barriers of culture, language, and geography. This recognition reflects her commitment to making healing inclusive, modern, and globally reachable, setting a new standard in wellness innovation.",
    our_core_values: "Our Core Values",
    core_values_desc:
      "These principles guide everything we do at Subconscious Valley",
    value_1_title: "Authentic Healing",
    value_1_desc:
      "Transformation lasts when the subconscious is addressed directly in your native language.",
    value_2_title: "Science-Based Approach",
    value_2_desc:
      "We combine hypnotherapy, NLP and brainwave entrainment for practical, testable results.",
    value_3_title: "Cultural Sensitivity",
    value_3_desc:
      "Healing is personal and cultural; our content is localized for Arabic, Hindi, English and many more regional audiences coming soon.",
    value_4_title: "Lasting Change",
    value_4_desc:
      "We focus on habit installation, not quick fixes designing audios that reinforce new neural pathways over time.",
    our_journey: "Our Journey",
    our_journey_desc:
      "From personal transformation to helping thousands heal across cultures",
    journey_1_title: "Professional Training",
    journey_1_desc:
      "Completed comprehensive NLP and clinical hypnotherapy certifications in Dubai and internationally, with specialization in subconscious reprogramming and habit formation.",
    journey_2_title: "Multilingual Practice",
    journey_2_desc:
      "Launched Arabic and Hindi protocols after seeing the dramatic impact of native-language hypnosis on emotional release, confidence, and behavior change.",
    journey_3_title: "Subconscious Valley Launch",
    journey_3_desc:
      "Founded the first platform in the region offering professional hypnotherapy, NLP, and guided audio across multiple languages-built on neuroscience and culturally aware practice.",
    our_mission: "Our Mission",
    our_mission_desc:
      "To make subconscious healing accessible to diverse communities by delivering professional hypnotherapy, NLP, and evidence-based audio programs in native languages. We bridge ancient wisdom and modern neuroscience to create sessions that respect culture and drive measurable habit change.",
    our_vision: "Our Vision",
    our_vision_desc:
      "A world where mental wellness transcends language barriers and every person can reprogram the subconscious mind in the language that feels like home, empowering communities to break generational patterns and create lasting change.",
    stat_countries: "Countries Served",
    stat_success: "Success Rate",
    ready_to_begin: "Ready to Begin Your Transformation?",
    ready_to_begin_desc:
      "Join a community using subconscious reprogramming to reduce anxiety, increase focus, and follow through-without therapy waitlists. Start in your native language.",

    // Sessions Page
    sessions_title: "Hypnosis Sessions",
    sessions_desc:
      "Transform your life with scientifically-backed Hypnotherapy & Neuro-Linguistic Programming (NLP). Available in multiple languages for deeper connection and lasting change.",
    all_categories: "All Categories",
    all_languages: "All Languages",
    available_in: "Available in:",
    start_session: "Start Session",
    view_collection: "View Collection",
    requires_subscription: "Requires Subscription",
    no_sessions_found: "No sessions found matching your filters.",
    clear_filters: "Clear Filters",

    // Blog Page
    blog_title: "Wellness & Transformation Blog",
    blog_desc:
      "Discover insights about mental wellness, hypnotherapy, and the science behind subconscious transformation.",
    featured_article: "Featured Article",
    read_full_article: "Read Full Article",
    read_more: "Read More",
    min_read: "min read",
    no_blog_posts: "No blog posts available yet.",
    check_back_soon: "Check back soon for our latest insights!",

    // Contact Page
    contact_title: "Get in Touch",
    contact_desc:
      "Ready to start your transformation journey? We're here to answer your questions and guide you toward the healing you deserve.",
    map_soon: "Interactive map coming soon",
    contact_form_desc:
      "Fill out the form below and we'll get back to you soon.",
    full_name: "Full Name",
    email_address: "Email Address",
    phone_number: "Phone Number",
    pref_language: "Preferred Language",
    subject: "Subject",
    message: "Message",
    message_placeholder: "Tell us how we can help you...",
    sending: "Sending...",
    send_message: "Send Message",
    message_sent: "Message Sent!",
    message_sent_desc:
      "Thank you for reaching out. We'll get back to you within 24 hours.",
    send_another: "Send Another Message",

    // Footer
    quick_links: "Quick Links",
    legal: "Legal",
    privacy_policy: "Privacy Policy",
    terms_conditions: "Terms & Conditions",
    all_rights_reserved: "All rights reserved.",

    // Terms Page
    terms_page_title:
      "Subconscious Valley - Disclaimer, Terms & Privacy Policy",
    terms_intro_text:
      "Welcome to Subconscious Valley. By accessing and using our website, programs, and hypnotherapy audios, you agree to the following terms and conditions. Please read carefully.",
    disclaimer_section: "1. Disclaimer",
    disclaimer_p1:
      "All hypnotherapy audios and content provided by Subconscious Valley are designed for relaxation, self-improvement, and personal growth. They are not a substitute for medical, psychiatric, or psychological diagnosis or treatment.",
    disclaimer_p2:
      "Individuals with epilepsy, seizure disorders, or other serious psychiatric or neurological conditions should not use our audios unless cleared by a licensed medical professional.",
    disclaimer_p3:
      "Do not listen to our audios while driving, operating machinery, or performing tasks that require full attention.",
    disclaimer_p4:
      "Results vary from person to person, and no specific outcomes are guaranteed.",
    disclaimer_p5:
      "By using our services, you acknowledge full responsibility for your own health and wellbeing.",
    purchases_section: "2. Purchases, Refund & Cancellation Policy",
    purchases_p1:
      "All products offered by Subconscious Valley are digital one-time purchases for personal use only.",
    purchases_p2:
      "Once a purchase is confirmed and access is granted, it cannot be canceled or refunded.",
    purchases_p3:
      "By purchasing, you agree that all sales are final and non-refundable.",
    ip_section: "3. Intellectual Property & Copyright",
    ip_p1:
      "All content on this website, including hypnotherapy audios, scripts, text, graphics, logos, and images, is the intellectual property of Subconscious Valley and is protected under copyright law.",
    ip_p2:
      "You are granted a license for personal, non-commercial use only of the purchased audios.",
    ip_p3:
      "Reproduction, resale, redistribution, uploading, or sharing of our content in any form is strictly prohibited and may result in legal action.",
    copyright_notice: "©2025 Subconscious Valley. All Rights Reserved.",
    privacy_section: "4. Privacy Policy",
    info_collect_label: "Information We Collect:",
    info_collect_text:
      "We may collect your name, email address, and payment details when you subscribe, purchase, or contact us.",
    info_use_label: "How We Use Your Information:",
    info_use_text:
      "To process payments, deliver products, send updates, and improve our services.",
    data_protection_label: "Data Protection:",
    data_protection_text:
      "Your personal data will never be sold, rented, or shared with third parties, except as necessary for payment processing or when required by law.",
    cookies_label: "Cookies:",
    cookies_text:
      "Our website may use cookies to improve user experience. You can disable cookies in your browser settings.",
    your_rights_label: "Your Rights:",
    your_rights_text:
      "You may request access, correction, or deletion of your data at any time by contacting us at hello@subconsciousvalley.com.",
    children_label: "Children:",
    children_text:
      "Our services are intended for adults 18+ or for minors with parental/guardian consent.",
    liability_section: "5. Limitation of Liability",
    liability_p1:
      "Subconscious Valley is not liable for any direct, indirect, or incidental damages arising from the use or inability to use our services.",
    liability_p2:
      "By accessing our website and using our products, you agree to release Subconscious Valley from any liability related to your personal outcomes or experiences.",
    governing_law_section: "6. Governing Law",
    governing_law_text:
      "These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, without regard to conflict of law principles.",
    got_questions: "Got Questions?",
    drop_email: "Drop us an email and we'll get back to you.",

    // Privacy Page
    privacy_page_title: "Subconscious Valley - Privacy Policy",
    privacy_intro_text:
      "Welcome to Subconscious Valley. By accessing and using our website, programs, and hypnotherapy audios, you agree to the following privacy policy. Please read carefully.",
    privacy_policy_section: "Privacy Policy",
  },

  ar: {
    // Navigation & General
    home: "الرئيسية",
    about: "نبذة عنا",
    sessions: "الجلسات",
    blog: "المدونة",
    contact: "تواصل معنا",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    admin: "مسؤول",
    purchase: "شراء",

    // Categories
    body_confidence: "الثقة بالجسم",
    self_love: "حب الذات",
    emotional_healing: "الشفاء العاطفي",
    freedom_path: "طريق الحرية",
    restful_nights: "ليالي مريحة",
    bright_minds: "عقول مشرقة",
    book_your_sessions: "احجز جلساتك",
    watch_video: "شاهد الفيديو",
    follow_us: "تابعنا",

    // Taglines & Headers
    heal_tagline: "اشفي روحك معنا.",
    brand_name: "وادي اللاوعي",

    // Homepage
    hero_title:
      "درّب عقلك الباطن اليوم. فهو يُدير أنفاسك ومعظم خياراتك اليومية. تُعيد جلسات التنويم المغناطيسي المدعومة علميًا وتسجيلات البرمجة اللغوية العصبية برمجة عقلك الباطن بهدوء بينما أنتيستريح",
    hero_sub_title_1:
      "لا مكالمات أو قوائم انتظار. اشترِ، شغّل، وبثّ.",
    hero_sub_title_2:
      "ثبّت عمدًا قيمًا افتراضية أفضل: الهدوء، والوضوح، والاتساق في العمل. ابدأ الآن ودع العلاج النفسي يقوم بالمهمة الصعبة.",
    hero_title_1: "القوة لإعادة كتابة",
    hero_title_2: "قصتك",
    hero_subtitle:
      "لأن التغيير الدائم يبدأ حيث يستمع عقلك حقاً - في أعماق اللاوعي.",
    multilingual_support_desc:
      "تسجيلات العلاج بالبرمجة اللغوية العصبية والتنويم المغناطيسي متعددة اللغات للتغيير العميق والدائم",
    start_your_transformation: "ابدأ تحولك",
    explore_programs: "استكشاف البرامج",
    get_in_touch: "تواصل معنا",
    video_welcome: "مرحباً بكم في وادي اللاوعي",
    video_discover: "تعرف على فانيتا باندي واكتشف تحولك",
    meet_vanita: "تعرف على فانيتا باندي",
    founder_intro_quote:
      "مرحباً بكم في وادي اللاوعي - حيث تلتقي جلسات البرمجة اللغوية العصبية والتنويم المغناطيسي القوية بالتحول الحقيقي في الحياة. لقد أنشأت هذه العلامة التجارية لأقدم لكم طريقة جديدة للشفاء - طريقة تعمل مع عقلكم الباطن لكسر الأنماط القديمة وبناء شخصية أقوى وأكثر سعادة.",
    founder_intro_p1:
      "أنا فانيتا باندي، ممارس معتمد في البرمجة اللغوية العصبية والتنويم المغناطيسي ولدي سنوات من الخبرة في توجيه الناس خلال التحولات العاطفية والعقلية والسلوكية. يركز عملي على إنشاء أدوات عملية ومتاحة تساعد الناس على الشفاء من الداخل، والتحكم في عاداتهم، والعيش بوضوح وثقة وفرح أكبر.",
    founder_intro_p2:
      "لأول مرة، تم تصميم تسجيلات الشفاء الآسيوية متعددة اللغات لتتحدث إلى قلبك وعقلك في نفس الوقت. هذا ليس مجرد مساعدة ذاتية - هذه هي نقطة تحولك.",
    science_based: "قائم على العلم",
    science_based_desc: "برمجة لغوية عصبية وتنويم مغناطيسي مدعوم بالأبحاث",
    read_full_story: "اقرأ قصتي كاملة",
    transformation_stories: "قصص التحول",
    transformation_stories_desc:
      "أشخاص حقيقيون، نتائج حقيقية. شاهد كيف ساعد وادي اللاوعي الآخرين على كسر الحواجز وتحقيق تغيير دائم.",
    verified: "موثق",
    our_collections: "مجموعات التحول لدينا",
    our_collections_desc:
      "برامج مصممة بعناية تعالج تحديات حقيقية - من القلق والصدمات إلى فقدان الوزن وتقدير الذات. كل جلسة مصممة بدقة.",
    explore_collection: "استكشف المجموعة",
    view_all_sessions: "عرض كل الجلسات",
    ready_to_start: "هل أنت مستعد لبدء رحلتك؟",
    ready_to_start_desc:
      "لديك أسئلة حول جلساتنا أو تحتاج إلى توجيه شخصي؟ نحن هنا لدعمك في كل خطوة على الطريق.",
    visit_us: "زورونا",
    email_us: "راسلنا عبر البريد الإلكتروني",
    whatsapp: "واتساب",
    send_us_message: "أرسل لنا رسالة",
    multilingual_support: "دعم متعدد اللغات",
    multilingual_support_contact_desc:
      "نتواصل باللغات الإنجليزية والهندية والعربية",
    personal_consultation: "استشارة شخصية",
    personal_consultation_desc: "مكالمات استكشافية مجانية لمدة 15 دقيقة متاحة",
    contact_us_now: "تواصل معنا الآن",
    final_cta_title: "تحولك يبدأ اليوم",
    final_cta_desc:
      "انضم إلى الآلاف الذين بدأوا بالفعل رحلة الشفاء مع وادي اللاوعي.",
    browse_sessions: "تصفح الجلسات",
    get_started: "ابدأ الآن",

    // Testimonials
    testimonial_1:
      "جلسات إنقاص الوزن غيرت علاقتي بالطعام تمامًا. لقد فقدت 15 كجم وأشعر بالروعة!",
    testimonial_2:
      "جلسات علاج القلق باللغة العربية ساعدتني بطرق لم يستطع العلاج التقليدي تحقيقها. أنا أخيرًا في سلام.",
    testimonial_3:
      "جلسات حب الذات باللغة الهندية لمست قلبي بعمق. الآن أتحدث مع نفسي بلطف.",
    //co-founer
    about_cofounder:
      " عامًا، مُمارسة معتمدة في مجال Access Bars، ولديها اهتمام كبير بالشفاء بالطاقة والوعي. ساهمت بشكل فعّال في المحتوى الصوتي لـ وادي الباطن، مُشكّلةً أجواءه الهادئة من خلال إسهامات تقنية فعّالة، وحسٍّ جمالي، وحساسية عالية للتأثير العاطفي/الطاقي للصوت. بصفتها مُبدعة شابة، تُجسّد سارة إيمان العلامة التجارية بأن الشفاء والوعي والإبداع لا حدود لهما بالعمر.",
    meet_cofounder: "تعرف على سارة",
    young_visionary: "شاب ذو رؤية",
    co_founder: "المؤسس المشارك",
    // About Page
    about_hero_title: "شفاء يخاطب",
    about_hero_title_2: "إلى عقلك الباطن",
    about_hero_desc:
      " تُعيد برمجة عقلك الباطن، الطبقة التي تُحرك العادات والمشاعر والقرارات التلقائية. يُقدم وادي العقل الباطن علاجًا بالتنويم المغناطيسي قائمًا على أسس علمية، وبرمجة عصبية لغوية، وجلسات صوتية مُوجهة تُعزز عاداتٍ أكثر هدوءًا، وتركيزًا أقوى، ونشاطًا مُستمرًا.وُلد وادي اللاوعي من إيمان بسيط وعميق: الشفاء الحقيقي يحدث عندما يتصل العلاج بعقلك وقلبك الثقافي.",
    story_behind_title: "القصة وراء وادي اللاوعي",
    story_behind_desc: "كل تحول يبدأ بقصة. هذه قصتي.",
    founder_about_quote:
      "أؤمن بأن كل شخص يحمل في داخله القوة للشفاء والتحول وخلق الحياة التي يرغب فيها حقًا. أحيانًا، نحتاج فقط إلى المفتاح الصحيح لفتح تلك القوة - وغالبًا ما يوجد هذا المفتاح في لغة قلوبنا.",
    why_multilingual_matters: "لماذا التعددية اللغوية مهمة",
    why_multilingual_p1:
      "تحدث الإنجازات أسرع عندما تتحدث إعادة برمجة اللاوعي لغتك الأم. من خلال عملنا في الشرق الأوسط وآسيا، شهدنا عملاء يُطلقون العنان لمشاعرهم ويحلون العقبات بمجرد تحول الجلسات إلى اللغة العربية أو الهندية أو لغتهم الأم.",
    why_multilingual_p2:
      "يربط العلاج بالتنويم المغناطيسي متعدد اللغات + البرمجة اللغوية العصبية المعتقدات الثقافية بعلم الأعصاب والعلاج الحديث، مما يجعل التأملات الموجهة ومزامنة الموجات الدماغية أكثر فعالية وأكثر شخصية.",
    founder_title: "المؤسس والممارس الرئيسي",
    certifications_training: "الشهادات والتدريب",
    lives_transformed: "حياة تم تحويلها",
    across_countries: "عبر لغات متعددة وأكثر من 15 دولة",
    languages_we_heal_in: "اللغات التي نشفي بها",
    many_more: "وغيرها الكثير...",
    awards_recognition: "الجوائز والتقدير",
    awards_desc:"يفخر وادي العقل الباطن بكونه اسمًا عالميًا مرموقًا في مجال العافية. وقد حازت مؤسسته، فانيتا باندي، على جائزة التميز المهني للابتكار العالمي في مجال العافية لعام ٢٠٢٥، تقديرًا لمساهمتها المتميزة في تغيير طريقة تجربة الناس للرفاهية العاطفية والنفسية.",
    awards_desc_2:"قدّم ابتكارها الرائد تجارب علاجية صوتية تُقدّم الشفاء مباشرةً للأفراد في أي وقت وفي أي مكان، بطريقة شخصية للغاية وسهلة المنال. وكرائدة في تقديم العلاجات بلغات آسيوية متعددة، حرصت فانيتا على أن يتجاوز العافية النفسية حواجز الثقافة واللغة والجغرافيا. يعكس هذا التكريم التزامها بجعل العلاج شاملاً وحديثاً ومتاحاً عالمياً، واضعةً معياراً جديداً في ابتكارات العافية.",
    our_core_values: "Our Core Values",
    our_core_values: "قيمنا الأساسية",
    core_values_desc: "هذه المبادئ توجه كل ما نقوم به في وادي اللاوعي",
    value_1_title: "شفاء أصيل",
    value_1_desc:
      "يحدث التحول عندما يتم توجيه العقل الباطن مباشرة إلى لغتك الأم",
    value_2_title: "نهج قائم على العلم",
    value_2_desc:
      "نحن نجمع بين العلاج بالتنويم المغناطيسي والبرمجة اللغوية العصبية وتنسيق الموجات الدماغية للحصول على نتائج عملية وقابلة للاختبار.",
    value_3_title: "حساسية ثقافية",
    value_3_desc:
      "الشفاء أمر شخصي وثقافي؛ ومحتوانا مترجم للغة العربية والهندية والإنجليزية والعديد من الجماهير الإقليمية الأخرى قريبًا.",
    value_4_title: "تغيير دائم",
    value_4_desc:
      "نحن نركز على تثبيت العادات، وليس على الحلول السريعة من خلال تصميم ملفات صوتية تعمل على تعزيز المسارات العصبية الجديدة بمرور الوقت.",
    our_journey: "رحلتنا",
    our_journey_desc:
      "من التحول الشخصي إلى مساعدة الآلاف على الشفاء عبر الثقافات",
    journey_1_title: "التدريب المهني",
    journey_1_desc:
      "أكملت شهادات البرمجة اللغوية العصبية والتنويم المغناطيسي الشاملة في دبي وعلى الصعيد الدولي.",
    journey_2_title: "ممارسة متعددة اللغات",
    journey_2_desc:
      "بدأت في تطوير جلسات بلغات متعددة بعد رؤية التأثير العميق للعلاج باللغة الأم.",
    journey_3_title: "إطلاق وادي اللاوعي",
    journey_3_desc:
      "أسست المنصة لجعل الشفاء التحويلي متاحًا للمجتمعات المتنوعة في جميع أنحاء العالم.",
    our_mission: "مهمتنا",
    our_mission_desc:
      "نجعل الشفاء اللاواعي متاحًا لمختلف المجتمعات من خلال تقديم العلاج بالتنويم المغناطيسي الاحترافي، والبرمجة اللغوية العصبية، والبرامج الصوتية المبنية على الأدلة باللغات الأم. نربط بين الحكمة القديمة وعلم الأعصاب الحديث لتقديم جلسات تحترم الثقافات وتدفع نحو تغيير عادات قابل للقياس.",
    our_vision: "رؤيتنا",
    our_vision_desc:
      "عالم حيث تتخطى العافية العقلية الحواجز اللغوية ويمكن لكل شخص إعادة برمجة العقل الباطن باللغة التي يشعر بها وكأنه وطنه، مما يمكّن المجتمعات من كسر الأنماط الجيلية وخلق تغيير دائم.",
    stat_countries: "الدول التي نخدمها",
    stat_success: "معدل النجاح",
    ready_to_begin: "هل أنت مستعد لبدء تحولك؟",
    ready_to_begin_desc:
      "انضم إلى مجتمع يستخدم إعادة برمجة اللاوعي لتخفيف القلق، وزيادة التركيز، ومتابعة العلاج - دون الحاجة إلى قوائم انتظار. ابدأ بلغتك الأم.",

    // Sessions Page
    sessions_title: "جلسات التنويم المغناطيسي",
    sessions_desc:
      "غيّر حياتك مع التنويم المغناطيسي والبرمجة اللغوية العصبية (NLP) المدعوم علميًا. متوفر بعدة لغات لتواصل أعمق وتغيير دائم.",
    all_categories: "جميع الفئات",
    all_languages: "جميع اللغات",
    available_in: "متوفر في:",
    start_session: "ابدأ الجلسة",
    view_collection: "عرض المجموعة",
    requires_subscription: "يتطلب اشتراك",
    no_sessions_found: "لم يتم العثور على جلسات تطابق عوامل التصفية الخاصة بك.",
    clear_filters: "مسح الفلاتر",

    // Blog Page
    blog_title: "مدونة العافية والتحول",
    blog_desc:
      "اكتشف رؤى حول العافية العقلية والعلاج بالتنويم المغناطيسي والعلم وراء التحول اللاواعي.",
    featured_article: "مقالة مميزة",
    read_full_article: "اقرأ المقال كاملاً",
    read_more: "اقرأ المزيد",
    min_read: "دقائق للقراءة",
    no_blog_posts: "لا توجد منشورات مدونة متاحة حتى الآن.",
    check_back_soon: "تحقق مرة أخرى قريبًا للحصول على أحدث رؤانا!",

    // Contact Page
    contact_title: "تواصل معنا",
    contact_desc:
      "هل أنت مستعد لبدء رحلة التحول الخاصة بك؟ نحن هنا للإجابة على أسئلتك وإرشادك نحو الشفاء الذي تستحقه.",
    map_soon: "خريطة تفاعلية قريبا",
    contact_form_desc: "املأ النموذج أدناه وسنعاود الاتصال بك قريبًا.",
    full_name: "الاسم الكامل",
    email_address: "عنوان البريد الإلكتروني",
    phone_number: "رقم الهاتف",
    pref_language: "اللغة المفضلة",
    subject: "الموضوع",
    message: "الرسالة",
    message_placeholder: "أخبرنا كيف يمكننا مساعدتك...",
    sending: "جار الإرسال...",
    send_message: "أرسل رسالة",
    message_sent: "تم إرسال الرسالة!",
    message_sent_desc: "شكرًا لك على تواصلك معنا. سنعود إليك في غضون 24 ساعة.",
    send_another: "أرسل رسالة أخرى",

    // Footer
    quick_links: "روابط سريعة",
    legal: "قانوني",
    privacy_policy: "سياسة الخصوصية",
    terms_conditions: "الشروط والأحكام",
    all_rights_reserved: "كل الحقوق محفوظة.",

    // Terms Page
    terms_page_title:
      "وادي العقل الباطن - إخلاء المسؤولية والشروط وسياسة الخصوصية",
    terms_intro_text:
      "أهلاً بكم في وادي العقل الباطن. بدخولكم واستخدامكم لموقعنا الإلكتروني وبرامجنا وتسجيلات التنويم المغناطيسي الصوتية، فإنكم توافقون على الشروط والأحكام التالية. يُرجى القراءة بعناية.",
    disclaimer_section: "1. إخلاء المسؤولية",
    disclaimer_p1:
      "جميع ملفات الصوت والمحتوى العلاجي بالتنويم المغناطيسي التي تقدمها وادي الوعي الباطني مصممة للاسترخاء وتحسين الذات والنمو الشخصي. وهي لا تغني عن التشخيص أو العلاج الطبي أو النفسي.",
    disclaimer_p2:
      "لا ينبغي للأشخاص المصابين بالصرع أو اضطرابات النوبات أو غيرها من الحالات النفسية أو العصبية الخطيرة استخدام ملفاتنا الصوتية إلا بعد الحصول على موافقة من طبيب مرخص.",
    disclaimer_p3:
      "ا تستمع إلى تسجيلاتنا الصوتية أثناء القيادة أو تشغيل الآلات أو أداء المهام التي تتطلب الاهتمام الكامل.",
    disclaimer_p4:
      "تختلف النتائج من شخص لآخر، ولا توجد نتائج محددة مضمونة.Results vary from person to person, and no specific outcomes are guaranteed.",
    disclaimer_p5:
      "عند استخدام خدماتنا، فإنك تقر بالمسؤولية الكاملة عن صحتك ورفاهتك.",
    purchases_section: "2. سياسة المشتريات والاسترداد والإلغاء",
    purchases_p1:
      "جميع المنتجات التي تقدمها Subconscious Valley هي عمليات شراء رقمية لمرة واحدة للاستخدام الشخصي فقط.",
    purchases_p2:
      "بمجرد تأكيد عملية الشراء ومنح الوصول إليها، لا يمكن إلغاؤها أو استرداد المبلغ.",
    purchases_p3:
      "من خلال الشراء، فإنك توافق على أن جميع المبيعات نهائية وغير قابلة للاسترداد.",
    ip_section: "3. الملكية الفكرية وحقوق النشر",
    ip_p1:
      "جميع المحتويات الموجودة على هذا الموقع، بما في ذلك ملفات صوتية التنويم المغناطيسي، والنصوص، والرسومات، والشعارات، والصور، هي ملكية فكرية لشركة Subconscious Valley وهي محمية بموجب قانون حقوق النشر.",
    ip_p2:
      "لقد تم منحك ترخيصًا للاستخدام الشخصي غير التجاري فقط للمقاطع الصوتية التي اشتريتها.",
    ip_p3:
      "يُحظر تمامًا إعادة إنتاج أو إعادة بيع أو إعادة توزيع أو تحميل أو مشاركة المحتوى الخاص بنا بأي شكل من الأشكال وقد يؤدي ذلك إلى اتخاذ إجراء قانوني.",
    copyright_notice: "©2025 وادي العقل الباطن. جميع الحقوق محفوظة.",
    privacy_section: "4. سياسة الخصوصية",
    info_collect_label: "المعلومات التي نجمعها:",
    info_collect_text:
      "يجوز لنا جمع اسمك وعنوان بريدك الإلكتروني وتفاصيل الدفع عند الاشتراك أو الشراء أو الاتصال بنا.",
    info_use_label: "كيف نستخدم معلوماتك:",
    info_use_text:
      "لمعالجة المدفوعات وتسليم المنتجات وإرسال التحديثات وتحسين خدماتنا.",
    data_protection_label: "حماية البيانات:",
    data_protection_text:
      "لن يتم بيع بياناتك الشخصية أو تأجيرها أو مشاركتها مع أطراف ثالثة، إلا إذا كان ذلك ضروريًا لمعالجة الدفع أو عندما يقتضي القانون ذلك.",
    cookies_label: "ملفات تعريف الارتباط:",
    cookies_text:
      "قد يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم. يمكنك تعطيل ملفات تعريف الارتباط في إعدادات المتصفح لديك.",
    your_rights_label: "حقوقك:",
    your_rights_text:
      "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت عن طريق الاتصال بنا على hello@subconsciousvalley.com.",
    children_label: "أطفال:",
    children_text:
      "خدماتنا مخصصة للبالغين 18 عامًا أو للقاصرين بموافقة الوالدين أو الوصي.",
    liability_section: "5. تحديد المسؤولية",
    liability_p1:
      "لا تتحمل شركة Subconscious Valley مسؤولية أي أضرار مباشرة أو غير مباشرة أو عرضية ناجمة عن استخدام خدماتنا أو عدم القدرة على استخدامها.",
    liability_p2:
      "من خلال الوصول إلى موقعنا الإلكتروني واستخدام منتجاتنا، فإنك توافق على إعفاء Subconscious Valley من أي مسؤولية تتعلق بنتائجك أو تجاربك الشخصية.",
    governing_law_section: "6. القانون الحاكم",
    governing_law_text:
      "تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة ويتم تفسيرها وفقًا لها، دون مراعاة مبادئ تضارب القوانين.",
    got_questions: "هل لديك أسئلة؟",
    drop_email: "أرسل لنا بريدًا إلكترونيًا وسنتصل بك.",

    // Privacy Page
    privacy_page_title: "وادي العقل الباطن - سياسة الخصوصية",
    privacy_intro_text:
      "أهلاً بكم في وادي العقل الباطن. بدخولكم واستخدامكم لموقعنا الإلكتروني وبرامجنا وتسجيلات التنويم المغناطيسي الصوتية، فإنكم توافقون على سياسة الخصوصية التالية. يُرجى القراءة بعناية.",
    privacy_policy_section: "سياسة الخصوصية",
  },

  hi: {
    // Navigation & General
    home: "मुख्य पृष्ठ",
    about: "हमारे बारे में",
    sessions: "सत्र",
    blog: "ब्लॉग",
    contact: "संपर्क",
    login: "लॉग इन",
    logout: "लॉग आउट",
    dashboard: "डैशबोर्ड",
    admin: "एडमिन",
    purchase: "खरीदें",

    // Categories
    body_confidence: "शरीर में आत्मविश्वास",
    self_love: "आत्म-प्रेम",
    emotional_healing: "भावनात्मक चिकित्सा",
    freedom_path: "स्वतंत्रता का रास्ता",
    restful_nights: "आरामदायक रातें",
    bright_minds: "उज्ज्वल दिमाग",
    book_your_sessions: "अपना सत्र बुक करें",
    watch_video: "वीडियो देखें",
    follow_us: "हमें फॉलो करें",

    // Taglines & Headers
    heal_tagline: "हमारे साथ अपनी आत्मा को चंगा करें।",
    brand_name: "सबकॉन्शस वैली",

    // Homepage
    hero_title:
      "आज ही अपने अवचेतन मन को प्रशिक्षित करें। यह पहले से ही आपकी साँसों और आपके अधिकांश दैनिक निर्णयों को नियंत्रित करता है। हमारी विज्ञान-समर्थित सम्मोहन चिकित्सा और एनएलपी ऑडियो चुपचाप अवचेतन मन को पुनः प्रोग्राम करते हैं, जबकि आप आराम करना",
    hero_sub_title_1:
      "कोई कॉल या वेटलिस्ट नहीं। खरीदें, प्ले बटन दबाएँ और स्ट्रीम करें।",
    hero_sub_title_2:
      "जानबूझकर बेहतर डिफ़ॉल्ट स्थापित करें: शांति, स्पष्टता और निरंतर कार्रवाई। अभी शुरुआत करें और थेरेपी को भारी काम करने दें।",
    hero_title_1: "अपनी कहानी को",
    hero_title_2: "फिर से लिखने की शक्ति",
    hero_subtitle:
      "क्योंकि स्थायी परिवर्तन वहीं से शुरू होता है जहां आपका मन सच में सुनता है - अवचेतन की गहराई में।",
    multilingual_support_desc:
      "गहरे, स्थायी परिवर्तन के लिए बहुभाषी NLP और हिप्नोथेरेपी ऑडियो",
    start_your_transformation: "अपना परिवर्तन शुरू करें",
    explore_programs: "कार्यक्रमों का पता लगाएं",
    get_in_touch: "संपर्क में रहें",
    video_welcome: "सबकॉन्शस वैली में आपका स्वागत है",
    video_discover: "वनिता पांडे से मिलें और अपने परिवर्तन की खोज करें",
    meet_vanita: "वनिता पांडे से मिलें",
    founder_intro_quote:
      "सबकॉन्शस वैली में आपका स्वागत है - जहां शक्तिशाली NLP और हिप्नोथेरेपी सत्र वास्तविक जीवन परिवर्तन से मिलते हैं। मैंने इस ब्रांड को बनाया है आपके लिए चंगाई का एक नया तरीका लाने के लिए - एक ऐसा तरीका जो आपके अवचेतन मन के साथ काम करके पुराने पैटर्न को तोड़ता है और एक मजबूत, खुश व्यक्तित्व बनाता है।",
    founder_intro_p1:
      "मैं वनिता पांडे हूँ, एक प्रमाणित NLP और हिप्नोथेरेपी प्रैक्टिशनर, जिसे भावनात्मक, मानसिक और व्यवहारिक परिवर्तनों के माध्यम से लोगों का मार्गदर्शन करने का वर्षों का अनुभव है। मेरा काम व्यावहारिक, सुलभ उपकरण बनाने पर केंद्रित है जो लोगों को भीतर से ठीक होने, अपनी आदतों पर नियंत्रण पाने और अधिक स्पष्टता, आत्मविश्वास और आनंद के साथ जीने में मदद करते हैं।",
    founder_intro_p2:
      "पहली बार, बहुभाषी एशियाई हीलिंग ऑडियो आपके दिल और दिमाग से एक ही समय में बात करने के लिए डिज़ाइन किए गए हैं। यह सिर्फ स्वयं-सहायता नहीं है - यह आपका महत्वपूर्ण मोड़ है।",
    science_based: "विज्ञान-आधारित",
    science_based_desc: "अनुसंधान द्वारा समर्थित NLP और हिप्नोथेरेपी",
    read_full_story: "मेरी पूरी कहानी पढ़ें",
    transformation_stories: "परिवर्तन की कहानियाँ",
    transformation_stories_desc:
      "वास्तविक लोग, वास्तविक परिणाम। देखें कि कैसे सबकॉन्शस वैली ने दूसरों को बाधाओं को तोड़ने और स्थायी परिवर्तन लाने में मदद की है।",
    verified: "सत्यापित",
    our_collections: "हमारे परिवर्तन संग्रह",
    our_collections_desc:
      "सावधानीपूर्वक तैयार किए गए कार्यक्रम जो वास्तविक चुनौतियों का समाधान करते हैं - चिंता और आघात से लेकर वजन घटाने और आत्म-सम्मान तक। प्रत्येक सत्र सटीकता के साथ डिज़ाइन किया गया है।",
    explore_collection: "संग्रह का अन्वेषण करें",
    view_all_sessions: "सभी सत्र देखें",
    ready_to_start: "क्या आप अपनी यात्रा शुरू करने के लिए तैयार हैं?",
    ready_to_start_desc:
      "क्या आपके पास हमारे सत्रों के बारे में प्रश्न हैं या व्यक्तिगत मार्गदर्शन की आवश्यकता है? हम हर कदम पर आपका समर्थन करने के लिए यहां हैं।",
    visit_us: "हमसे मिलें",
    email_us: "हमें ईमेल करें",
    whatsapp: "व्हाट्सएप",
    send_us_message: "हमें एक संदेश भेजें",
    multilingual_support: "बहुभाषी समर्थन",
    multilingual_support_contact_desc:
      "हम अंग्रेजी, हिंदी और अरबी में संवाद करते हैं",
    personal_consultation: "व्यक्तिगत परामर्श",
    personal_consultation_desc: "मुफ्त 15 मिनट की खोज कॉल उपलब्ध है",
    contact_us_now: "अब हमसे संपर्क करें",
    final_cta_title: "आपका परिवर्तन आज शुरू होता है",
    final_cta_desc:
      "उन हजारों लोगों से जुड़ें जिन्होंने पहले ही सबकॉन्शस वैली के साथ अपनी उपचार यात्रा शुरू कर दी है।",
    browse_sessions: "सत्र ब्राउज़ करें",
    get_started: "शुरू करें",

    // Testimonials
    testimonial_1:
      "वजन घटाने के सत्रों ने भोजन के साथ मेरे रिश्ते को पूरी तरह से बदल दिया। मैंने 15 किलो वजन कम किया है और अद्भुत महसूस कर रही हूँ!",
    testimonial_2:
      "अरबी में चिंता सत्रों ने मुझे उन तरीकों से मदद की जो पारंपरिक चिकित्सा नहीं कर सकी। मैं अंत में शांति में हूँ।",
    testimonial_3:
      "हिंदी में आत्म-प्रेम सत्रों ने मेरे दिल को गहराई से छुआ। अब मैं खुद से दया से बात करती हूँ।",

    //co-founer
    //co-founer
    about_cofounder:
      "15 वर्षीय सारा एक प्रमाणित एक्सेस बार्स प्रैक्टिशनर हैं, जिन्हें ऊर्जा चिकित्सा और चेतना कार्य में गहरी रुचि है। उन्होंने सबकॉन्शस वैली की ऑडियो सामग्री में सार्थक योगदान दिया है, जो ठोस तकनीकी इनपुट, सौंदर्यशास्त्र की समझ और ध्वनि के भावनात्मक/ऊर्जावान प्रभाव के प्रति संवेदनशीलता के माध्यम से इसके शांत माहौल को आकार देता है। एक युवा निर्माता के रूप में, वह ब्रांड के इस विश्वास को मूर्त रूप देती हैं कि उपचार, जागरूकता और रचनात्मकता उम्र से सीमित नहीं हैं।",
    meet_cofounder: "सारा से मिलें",
    young_visionary: "युवा दूरदर्शी",
    co_founder: "सह-संस्थापक",
    // About Page
    about_hero_title: "चिकित्सा जो बोलती है",
    about_hero_title_2: "आपके अवचेतन तक",
    about_hero_desc:
      "सच्चा बदलाव तब होता है जब आप अवचेतन मन को पुनः प्रोग्राम करते हैं - वह परत जो आदतों, भावनाओं और स्वचालित निर्णयों को संचालित करती है। सबकॉन्शियस वैली विज्ञान आधारित सम्मोहन चिकित्सा, एनएलपी और निर्देशित ऑडियो सत्र प्रदान करती है जो शांत स्वभाव, मज़बूत एकाग्रता और निरंतर कार्रवाई स्थापित करते हैं।",
    story_behind_title: "सबकॉन्शस वैली के पीछे की कहानी",
    story_behind_desc: "हर परिवर्तन एक कहानी से शुरू होता है। यह मेरी है।",
    founder_about_quote:
      "मेरा मानना ​​है कि प्रत्येक व्यक्ति अपने भीतर चंगा करने, बदलने और वास्तव में इच्छित जीवन बनाने की शक्ति रखता है। कभी-कभी, हमें उस शक्ति को अनलॉक करने के लिए बस सही कुंजी की आवश्यकता होती है - और वह कुंजी अक्सर हमारे दिल की भाषा में पाई जाती है।",
    why_multilingual_matters: "बहुभाषी क्यों मायने रखता है",
    why_multilingual_p1:
      "जब अवचेतन पुनर्प्रोग्रामिंग आपकी मातृभाषा में होती है, तो सफलताएँ तेज़ी से मिलती हैं। मध्य पूर्व और एशिया में काम करते हुए, हमने देखा कि जैसे ही सत्र अरबी, हिंदी या उनकी मूल भाषा में शुरू हुए, ग्राहकों ने अपनी भावनाओं को उजागर किया और रुकावटों को दूर किया।",
    why_multilingual_p2:
      "बहुभाषी सम्मोहन चिकित्सा + एनएलपी सांस्कृतिक विश्वासों को आधुनिक तंत्रिका विज्ञान और चिकित्सा के साथ जोड़ती है, जिससे निर्देशित ध्यान और मस्तिष्क तरंग-प्रशिक्षण ऑडियो अधिक प्रभावी और अधिक व्यक्तिगत बन जाते हैं।",
    founder_title: "संस्थापक और प्रमुख व्यवसायी",
    certifications_training: "प्रमाणन और प्रशिक्षण",
    lives_transformed: "जीवन बदल गए",
    across_countries: "कई भाषाओं और 15+ देशों में",
    languages_we_heal_in: "भाषाएँ जिनमें हम उपचार करते हैं",
    many_more: "और भी बहुत कुछ...",
    awards_recognition: "पुरस्कार और मान्यता",
    awards_desc:"सबकॉन्शियस वैली, वेलनेस उद्योग में एक विश्वव्यापी मान्यता प्राप्त नाम होने पर गर्व महसूस करती है। इसकी संस्थापक, वनिता पांडे को ग्लोबल वेलनेस इनोवेशन 2025 के लिए प्रोफेशनल एक्सीलेंस अवार्ड्स से सम्मानित किया गया है, जो लोगों के भावनात्मक और मानसिक स्वास्थ्य के अनुभव को बदलने में उनके उत्कृष्ट योगदान का सम्मान करता है।",
    awards_desc_2:"उनके अभूतपूर्व नवाचार ने ऑडियो-आधारित थेरेपी अनुभवों को प्रस्तुत किया है जो किसी भी समय, कहीं भी, अत्यंत व्यक्तिगत और सुलभ तरीके से सीधे लोगों तक उपचार पहुँचाते हैं। कई एशियाई भाषाओं में थेरेपी प्रदान करने में अग्रणी होने के नाते, वनिता ने यह सुनिश्चित किया कि भावनात्मक कल्याण संस्कृति, भाषा और भूगोल की बाधाओं को पार करे। यह सम्मान उपचार को समावेशी, आधुनिक और विश्वव्यापी रूप से सुलभ बनाने के प्रति उनकी प्रतिबद्धता को दर्शाता है, जो कल्याण नवाचार में एक नया मानक स्थापित करता है।",
    our_core_values: "हमारे मूल मूल्य",
    core_values_desc:
      "ये सिद्धांत सबकॉन्शस वैली में हम जो कुछ भी करते हैं उसका मार्गदर्शन करते हैं",
    value_1_title: "प्रामाणिक उपचार",
    value_1_desc:
      "परिवर्तन तब स्थायी होता है जब अवचेतन मन को सीधे अपनी मूल भाषा में संबोधित किया जाता है।",
    value_2_title: "विज्ञान आधारित दृष्टिकोण",
    value_2_desc:
      "हम व्यावहारिक, परीक्षण योग्य परिणामों के लिए सम्मोहन चिकित्सा, एनएलपी और ब्रेनवेव ट्रेनिंग को संयोजित करते हैं।",
    value_3_title: "सांस्कृतिक संवेदनशीलता",
    value_3_desc:
      "उपचार व्यक्तिगत और सांस्कृतिक है; हमारी सामग्री अरबी, हिंदी, अंग्रेजी और कई अन्य क्षेत्रीय दर्शकों के लिए स्थानीयकृत है, जो जल्द ही आने वाली है।",
    value_4_title: "स्थायी परिवर्तन",
    value_4_desc:
      "हम आदत डालने पर ध्यान केंद्रित करते हैं, न कि त्वरित सुधार के लिए ऑडियो डिजाइन करने पर जो समय के साथ नए तंत्रिका मार्गों को सुदृढ़ करते हैं।",
    our_journey: "हमारी यात्रा",
    our_journey_desc:
      "व्यक्तिगत परिवर्तन से लेकर संस्कृतियों में हजारों लोगों को ठीक करने में मदद करने तक",
    journey_1_title: "व्यावसायिक प्रशिक्षण",
    journey_1_desc:
      "दुबई और अंतरराष्ट्रीय स्तर पर व्यापक एनएलपी और सम्मोहन चिकित्सा प्रमाणपत्र पूरे किए।",
    journey_2_title: "बहुभाषी अभ्यास",
    journey_2_desc:
      "मातृभाषा चिकित्सा के गहरे प्रभाव को देखने के बाद कई भाषाओं में सत्र विकसित करना शुरू किया।",
    journey_3_title: "सबकॉन्शस वैली लॉन्च",
    journey_3_desc:
      "दुनिया भर के विविध समुदायों के लिए परिवर्तनकारी उपचार सुलभ बनाने के लिए मंच की स्थापना की।",
    our_mission: "हमारा विशेष कार्य",
    our_mission_desc:
      "पेशेवर सम्मोहन चिकित्सा, एनएलपी और स्थानीय भाषाओं में साक्ष्य-आधारित ऑडियो कार्यक्रम प्रदान करके अवचेतन उपचार को विविध समुदायों के लिए सुलभ बनाना। हम प्राचीन ज्ञान और आधुनिक तंत्रिका विज्ञान का संयोजन करके ऐसे सत्र तैयार करते हैं जो संस्कृति का सम्मान करते हैं और आदतों में उल्लेखनीय बदलाव लाते हैं।",
    our_vision: "हमारी दृष्टि",
    our_vision_desc:
      "एक ऐसा विश्व जहां मानसिक स्वास्थ्य भाषा की बाधाओं से परे हो और प्रत्येक व्यक्ति अपने अवचेतन मन को उस भाषा में पुनः प्रोग्राम कर सके जो उसे घर जैसा महसूस हो, जिससे समुदायों को पीढ़ीगत पैटर्न को तोड़ने और स्थायी परिवर्तन लाने के लिए सशक्त बनाया जा सके।",
    stat_countries: "सेवा प्रदान किए गए देश",
    stat_success: "सफलता दर",
    ready_to_begin: "क्या आप अपना परिवर्तन शुरू करने के लिए तैयार हैं?",
    ready_to_begin_desc:
      "चिंता कम करने, ध्यान केंद्रित करने और बिना किसी प्रतीक्षा सूची के थेरेपी का पालन करने के लिए अवचेतन पुनर्प्रोग्रामिंग का उपयोग करने वाले समुदाय में शामिल हों। अपनी मातृभाषा से शुरुआत करें।",

    // Sessions Page
    sessions_title: "सम्मोहन सत्र",
    sessions_desc:
      "वैज्ञानिक रूप से समर्थित हिप्नोथेरेपी और न्यूरो-लिंग्विस्टिक प्रोग्रामिंग (एनएलपी) के साथ अपने जीवन को बदलें। गहरे जुड़ाव और स्थायी बदलाव के लिए कई भाषाओं में उपलब्ध।",
    all_categories: "सभी श्रेणियाँ",
    all_languages: "सभी भाषाएँ",
    available_in: "में उपलब्ध:",
    start_session: "सत्र शुरू करें",
    view_collection: "संग्रह देखें",
    requires_subscription: "सदस्यता की आवश्यकता है",
    no_sessions_found: "आपके फ़िल्टर से मेल खाने वाला कोई सत्र नहीं मिला।",
    clear_filters: "फ़िल्टर साफ़ करें",

    // Blog Page
    blog_title: "कल्याण और परिवर्तन ब्लॉग",
    blog_desc:
      "मानसिक कल्याण, सम्मोहन चिकित्सा, और अवचेतन परिवर्तन के पीछे के विज्ञान के बारे में अंतर्दृष्टि की खोज करें।",
    featured_article: "विशेष रुप से प्रदर्शित लेख",
    read_full_article: "पूरा लेख पढ़ें",
    read_more: "और पढ़ें",
    min_read: "मिनट पढ़ें",
    no_blog_posts: "अभी तक कोई ब्लॉग पोस्ट उपलब्ध नहीं है।",
    check_back_soon: "हमारी नवीनतम अंतर्दृष्टि के लिए जल्द ही वापस देखें!",

    // Contact Page
    contact_title: "संपर्क में रहें",
    contact_desc:
      "अपनी परिवर्तन यात्रा शुरू करने के लिए तैयार हैं? हम आपके सवालों का जवाब देने और आपको उस उपचार की ओर मार्गदर्शन करने के लिए यहां हैं।",
    map_soon: "इंटरैक्टिव नक्शा जल्द ही आ रहा है",
    contact_form_desc:
      "नीचे दिया गया फ़ॉर्म भरें और हम जल्द ही आपसे संपर्क करेंगे।",
    full_name: "पूरा नाम",
    email_address: "ईमेल पता",
    phone_number: "फ़ोन नंबर",
    pref_language: "पसंदीदा भाषा",
    subject: "विषय",
    message: "संदेश",
    message_placeholder: "हमें बताएं कि हम आपकी कैसे मदद कर सकते हैं...",
    sending: "भेजा जा रहा है...",
    send_message: "संदेश भेजें",
    message_sent: "संदेश भेजा गया!",
    message_sent_desc:
      "हमसे संपर्क करने के लिए धन्यवाद। हम 24 घंटे के भीतर आपसे संपर्क करेंगे।",
    send_another: "दूसरा संदेश भेजें",

    // Footer
    quick_links: "त्वरित लिंक",
    legal: "कानूनी",
    privacy_policy: "गोपनीयता नीति",
    terms_conditions: "नियम और शर्तें",
    all_rights_reserved: "सर्वाधिकार सुरक्षित।",
    terms_page_title: "अवचेतन घाटी - अस्वीकरण, नियम और गोपनीयता नीति",
    terms_intro_text:
      "अवचेतन घाटी में आपका स्वागत है। हमारी वेबसाइट, प्रोग्राम और सम्मोहन ऑडियो रिकॉर्डिंग तक आपकी पहुंच और उपयोग के साथ, आप निम्नलिखित नियमों और शर्तों से सहमत होते हैं। कृपया ध्यान से पढ़ें।",
    disclaimer_section: "1. अस्वीकरण",
    disclaimer_p1:
      "हमारे द्वारा प्रदान किए गए सभी ऑडियो फाइलें और सम्मोहन चिकित्सा उपचार सामग्री विश्राम, आत्म-सुधार और व्यक्तिगत विकास के लिए डिज़ाइन की गई हैं। ये निदान या चिकित्सा या मनोवैज्ञानिक उपचार का विकल्प नहीं हैं।",
    disclaimer_p2:
      "मिर्गी या दौरे विकार या अन्य गंभीर मानसिक या न्यूरोलॉजिकल स्थितियों वाले व्यक्तियों को हमारे ऑडियो का उपयोग केवल एक लाइसेंस प्राप्त चिकित्सक की मंजूरी के बाद करना चाहिए।",
    disclaimer_p3:
      "ड्राइविंग या मशीनरी चलाने या पूर्ण ध्यान की आवश्यकता वाले कार्यों को करते समय हमारे रिकॉर्डिंग सुनना उचित नहीं है।",
    disclaimer_p4:
      "परिणाम व्यक्ति से व्यक्ति भिन्न होते हैं, और कोई विशिष्ट परिणाम गारंटीकृत नहीं हैं।",
    disclaimer_p5:
      " हमारे सेवाओं का उपयोग करते समय, आप अपनी स्वास्थ्य और कल्याण के लिए पूरी जिम्मेदारी स्वीकार करते हैं।",
    purchases_section: "2. खरीद, रिफंड और रद्दीकरण नीति",
    purchases_p1:
      "सबकॉन्शस वैली द्वारा प्रदान किए गए सभी उत्पाद व्यक्तिगत उपयोग के लिए एक बार की डिजिटल खरीद हैं।",
    purchases_p2:
      "एक बार खरीद की पुष्टि और एक्सेस प्रदान करने के बाद, इसे रद्द या रिफंड नहीं किया जा सकता है।",
    purchases_p3:
      "खरीदारी के माध्यम से, आप सहमत होते हैं कि सभी बिक्री अंतिम हैं और रिफंड योग्य नहीं हैं।",
    ip_section: "3. बौद्धिक संपदा और कॉपीराइट",
    ip_p1:
      "इस वेबसाइट पर सभी सामग्री, जिसमें सम्मोहन ऑडियो फाइलें, लिपियाँ, ग्राफिक्स, लोगो, और छवियां शामिल हैं, सबकॉन्शस वैली की बौद्धिक संपदा हैं और कॉपीराइट कानून द्वारा संरक्षित हैं।",
    ip_p2:
      "आपके द्वारा खरीदी गई ऑडियो क्लिप्स के लिए आपको केवल व्यक्तिगत गैर-वाणिज्यिक उपयोग के लिए एक लाइसेंस दिया गया है।",
    ip_p3:
      "हमारी सामग्री को किसी भी रूप में पुन: उत्पन्न, पुनर्विक्रय, पुनर्वितरित, अपलोड या साझा करना सख्त वर्जित है और इसके लिए कानूनी कार्रवाई हो सकती है।",
    copyright_notice: "©2025 अवचेतन घाटी। सर्वाधिकार सुरक्षित।",
    privacy_section: "4. गोपनीयता नीति",
    info_collect_label: "हम जो जानकारी एकत्र करते हैं:",
    info_collect_text:
      "जब आप सदस्यता लेते हैं, खरीदारी करते हैं, या हमसे संपर्क करते हैं तो हम आपका नाम, ईमेल पता, और भुगतान विवरण एकत्र कर सकते हैं।",
    info_use_label: "हम आपकी जानकारी का उपयोग कैसे करते हैं:",
    info_use_text:
      "भुगतान संसाधित करने, उत्पाद वितरित करने, अपडेट भेजने, और हमारी सेवाओं में सुधार करने के लिए।",
    data_protection_label: "डेटा सुरक्षा:",
    data_protection_text:
      "आपका व्यक्तिगत डेटा बेचा, किराए पर नहीं दिया जाएगा, या तीसरे पक्ष के साथ साझा नहीं किया जाएगा, सिवाय इसके कि भुगतान संसाधित करने के लिए आवश्यक हो या जब कानून द्वारा आवश्यक हो।",
    cookies_label: "कुकीज़:",
    cookies_text:
      "हमारी वेबसाइट उपयोगकर्ता अनुभव में सुधार के लिए कुकीज़ का उपयोग कर सकती है। आप अपने ब्राउज़र सेटिंग्स में कुकीज़ अक्षम कर सकते हैं।",
    your_rights_label: "आपके अधिकार:",
    your_rights_text:
      "आप कभी भी हमसे संपर्क करके अपने डेटा तक पहुंच, इसे सुधारने, या हटाने का अनुरोध कर सकते हैं।",
    children_label: "बच्चे:",
    children_text:
      "हमारी सेवाएं 18 वर्ष या उससे अधिक उम्र के वयस्कों के लिए हैं या माता-पिता या अभिभावक की सहमति से नाबालिगों के लिए हैं।",
    liability_section: "5. दायित्व की सीमा",
    liability_p1:
      "सबकॉन्शस वैली हमारे सेवाओं के उपयोग या उपयोग में असमर्थता से उत्पन्न किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक नुकसान के लिए जिम्मेदार नहीं है।",
    liability_p2:
      "हमारी वेबसाइट तक पहुंचने और हमारे उत्पादों का उपयोग करके, आप सबकॉन्शस वैली को आपकी व्यक्तिगत परिणामों या अनुभवों से संबंधित किसी भी दायित्व से मुक्त करने के लिए सहमत होते हैं।",
    governing_law_section: "6. शासक कानून",
    governing_law_text:
      "ये शर्तें संयुक्त अरब अमीरात के कानूनों के अधीन हैं और उनके अनुसार व्याख्या की जाती हैं, बिना किसी कानून संघर्ष सिद्धांतों को ध्यान में रखे।",
    got_questions: "क्या आपके पास प्रश्न हैं?",
    drop_email: "हमें एक ईमेल भेजें और हम आपसे संपर्क करेंगे।",

    // Privacy Page
    privacy_page_title: "अवचेतन घाटी - गोपनीयता नीति",
    privacy_intro_text:
      "अवचेतन घाटी में आपका स्वागत है। हमारी वेबसाइट, प्रोग्राम और सम्मोहन ऑडियो रिकॉर्डिंग तक आपकी पहुंच और उपयोग के साथ, आप निम्नलिखित गोपनीयता नीति से सहमत होते हैं। कृपया ध्यान से पढ़ें।",
    privacy_policy_section: "गोपनीयता नीति",
  },
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    // Get language from local storage after component mounts
    const savedLanguage = localStorage.getItem("language") || "en";
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    // Apply language direction and attribute on initial load and when language changes
    if (typeof document !== "undefined") {
      document.dir = currentLanguage === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = currentLanguage;
    }
    // Save language to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("language", currentLanguage);
    }
  }, [currentLanguage]);

  const t = (key) => {
    // Use optional chaining to safely access translations, fallback to English, then key itself
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    // The document.dir and document.documentElement.lang updates are now handled by the useEffect hook
  };

  const isRTL = currentLanguage === "ar";

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        t,
        isRTL,
        translations, // Expose the translations object itself
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
