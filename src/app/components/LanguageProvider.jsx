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
    book_your_sessions:"Book Your Sessions",
    watch_video: "Watch Video",
    follow_us: "Follow Us",
    // Taglines & Headers
    heal_tagline: "Heal your soul with us.",
    brand_name: "Subconscious Valley",

    // Homepage
    hero_title:"Train your subconscious today. It already runs your breathing. Professional audio sessions rewire habits while you simply listen nightly",
    hero_sub_title_1:"No therapist calls. Purchase the audio, press play, and stream. Breathing proves your subconscious runs vital systems automatically.",
    hero_sub_title_2:"Train it deliberately. Rehearse success, rehearse calm, rehearse action. Book your session today and install better defaults.",
    hero_title_1: "The Power to Rewrite",
    hero_title_2: "Your Story",
    hero_subtitle:
      "Because lasting change begins where your mind truly listens - deep in the subconscious.",
    multilingual_support_desc:
      "Multilingual NLP & Hypnotherapy Audios for Deep, Lasting Change",
    start_your_transformation: "Start Your Transformation",
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
    co_founder:"Co Founder",
    about_cofounder:"Sara, 15, is a certified Access Bars Practitioner with a strong interest in energy healing and consciousness work. She's contributed meaningfully to SubconsciousValley's audio content shaping its calming feel through solid technical input, aesthetic sense, and sensitivity to the emotional/energetic impact of sound. As a young creator, she embodies the brand's belief that healing, awareness, and creativity aren't limited by age.",
    meet_cofounder:"Meet Sara",
    young_visionary:"Young Visionary",
    // About Page
    about_hero_title: "Healing That Speaks",
    about_hero_title_2: "to Your Soul",
    about_hero_desc:
      "Subconscious Valley was born from a simple yet profound belief: true healing happens when therapy connects with both your mind and your cultural heart.",
    story_behind_title: "The Story Behind Subconscious Valley",
    story_behind_desc: "Every transformation begins with a story. Here's mine.",
    founder_about_quote:
      "I believe that every person carries within them the power to heal, transform, and create the life they truly desire. Sometimes, we just need the right key to unlock that power - and that key is often found in the language of our heart.",
    why_multilingual_matters: "Why Multilingual Matters",
    why_multilingual_p1:
      "After working with clients from diverse backgrounds across the Middle East and Asia, I noticed something remarkable: breakthrough moments often happened when we switched to their mother tongue. Hindi sessions unlocked emotions that English couldn't reach. Arabic hypnosis connected with cultural beliefs in ways that felt authentic and powerful.",
    why_multilingual_p2:
      "This realization inspired Subconscious Valley - the first platform to offer professional hypnotherapy across multiple languages, designed specifically for the diverse communities of the Middle East and Asia.",
    founder_title: "Founder & Lead Practitioner",
    certifications_training: "Certifications & Training",
    lives_transformed: "Lives Transformed",
    across_countries: "Across multiple languages and 15+ countries",
    languages_we_heal_in: "Languages We Heal In",
    many_more: "Many more...",
    our_core_values: "Our Core Values",
    core_values_desc:
      "These principles guide everything we do at Subconscious Valley",
    value_1_title: "Authentic Healing",
    value_1_desc:
      "We believe true transformation happens when therapy speaks to your heart in your native language.",
    value_2_title: "Science-Based Approach",
    value_2_desc:
      "Our methods combine ancient wisdom with modern neuroscience and evidence-based hypnotherapy techniques.",
    value_3_title: "Cultural Sensitivity",
    value_3_desc:
      "Understanding that healing is deeply personal and cultural, we honor diverse backgrounds and languages.",
    value_4_title: "Lasting Change",
    value_4_desc:
      "We focus on subconscious reprogramming for permanent transformation, not temporary fixes.",
    our_journey: "Our Journey",
    our_journey_desc:
      "From personal transformation to helping thousands heal across cultures",
    journey_1_title: "Professional Training",
    journey_1_desc:
      "Completed comprehensive NLP and hypnotherapy certifications in Dubai and internationally.",
    journey_2_title: "Multilingual Practice",
    journey_2_desc:
      "Began developing sessions in multiple languages after seeing the profound impact of native-language therapy.",
    journey_3_title: "Subconscious Valley Launch",
    journey_3_desc:
      "Founded the platform to make transformational healing accessible to diverse communities worldwide.",
    our_mission: "Our Mission",
    our_mission_desc:
      "To make transformational healing accessible to diverse communities by delivering professional hypnotherapy and NLP in the languages that speak to their hearts. We bridge the gap between ancient wisdom and modern neuroscience, creating a healing experience that honors both culture and science.",
    our_vision: "Our Vision",
    our_vision_desc:
      "To create a world where mental wellness transcends language barriers, where every person can access the healing they need in the language that feels like home. We envision communities healed from within, empowered to break generational patterns and create lasting positive change.",
    stat_countries: "Countries Served",
    stat_success: "Success Rate",
    ready_to_begin: "Ready to Begin Your Transformation?",
    ready_to_begin_desc:
      "Join our community of healers and discover the power of subconscious change in your native language.",

    // Sessions Page
    sessions_title: "Hypnosis Sessions",
    sessions_desc:
      "Transform your life with our scientifically-backed hypnotherapy sessions. Available in multiple languages for deeper connection and lasting change.",
    all_categories: "All Categories",
    all_languages: "All Languages",
    available_in: "Available in:",
    start_session: "Start Session",
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
    book_your_sessions:"احجز جلساتك",
    watch_video: "شاهد الفيديو",
    follow_us: "تابعنا",

    // Taglines & Headers
    heal_tagline: "اشفي روحك معنا.",
    brand_name: "وادي اللاوعي",

    // Homepage
    hero_title:"درّب عقلك الباطن اليوم؛ فهو بالفعل يدير تنفّسك .جلسات صوتية احترافية تعيد برمجة العادات بينما تكتفي بالاستماع ليلًا.",
    hero_sub_title_1:"لا حاجة لمكالمات مع مُعالج. اشترِ الملف الصوتي، اضغط تشغيل، واستمع بالبثّ من الموقع. التنفّس دليل على أن عقلك الباطن يدير الأنظمة الحيوية تلقائيًا. درّبه عن قصد.",
    hero_sub_title_2:"تمرّن على النجاح، تمرّن على الهدوء، تمرّن على الفعل. احجز جلستك اليوم وثبّت إعدادات أفضل.",
    hero_title_1: "القوة لإعادة كتابة",
    hero_title_2: "قصتك",
    hero_subtitle:
      "لأن التغيير الدائم يبدأ حيث يستمع عقلك حقاً - في أعماق اللاوعي.",
    multilingual_support_desc:
      "تسجيلات العلاج بالبرمجة اللغوية العصبية والتنويم المغناطيسي متعددة اللغات للتغيير العميق والدائم",
    start_your_transformation: "ابدأ تحولك",
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
    about_cofounder:" عامًا، مُمارسة معتمدة في مجال Access Bars، ولديها اهتمام كبير بالشفاء بالطاقة والوعي. ساهمت بشكل فعّال في المحتوى الصوتي لـ وادي الباطن، مُشكّلةً أجواءه الهادئة من خلال إسهامات تقنية فعّالة، وحسٍّ جمالي، وحساسية عالية للتأثير العاطفي/الطاقي للصوت. بصفتها مُبدعة شابة، تُجسّد سارة إيمان العلامة التجارية بأن الشفاء والوعي والإبداع لا حدود لهما بالعمر.",
    meet_cofounder:"تعرف على سارة",
    young_visionary:"شاب ذو رؤية",
    co_founder:"المؤسس المشارك",
    // About Page
    about_hero_title: "شفاء يخاطب",
    about_hero_title_2: "روحك",
    about_hero_desc:
      "وُلد وادي اللاوعي من إيمان بسيط وعميق: الشفاء الحقيقي يحدث عندما يتصل العلاج بعقلك وقلبك الثقافي.",
    story_behind_title: "القصة وراء وادي اللاوعي",
    story_behind_desc: "كل تحول يبدأ بقصة. هذه قصتي.",
    founder_about_quote:
      "أؤمن بأن كل شخص يحمل في داخله القوة للشفاء والتحول وخلق الحياة التي يرغب فيها حقًا. أحيانًا، نحتاج فقط إلى المفتاح الصحيح لفتح تلك القوة - وغالبًا ما يوجد هذا المفتاح في لغة قلوبنا.",
    why_multilingual_matters: "لماذا التعددية اللغوية مهمة",
    why_multilingual_p1:
      "بعد العمل مع عملاء من خلفيات متنوعة في جميع أنحاء الشرق الأوسط وآسيا، لاحظت شيئًا رائعًا: لحظات الاختراق غالبًا ما تحدث عندما نتحول إلى لغتهم الأم. فتحت الجلسات الهندية مشاعر لم تستطع الإنجليزية الوصول إليها. تواصل التنويم المغناطيسي العربي مع المعتقدات الثقافية بطرق شعرت بأنها أصيلة وقوية.",
    why_multilingual_p2:
      "ألهم هذا الإدراك وادي اللاوعي - أول منصة تقدم العلاج بالتنويم المغناطيسي الاحترافي عبر لغات متعددة، مصممة خصيصًا للمجتمعات المتنوعة في الشرق الأوسط وآسيا.",
    founder_title: "المؤسس والممارس الرئيسي",
    certifications_training: "الشهادات والتدريب",
    lives_transformed: "حياة تم تحويلها",
    across_countries: "عبر لغات متعددة وأكثر من 15 دولة",
    languages_we_heal_in: "اللغات التي نشفي بها",
    many_more: "وغيرها الكثير...",
    our_core_values: "قيمنا الأساسية",
    core_values_desc: "هذه المبادئ توجه كل ما نقوم به في وادي اللاوعي",
    value_1_title: "شفاء أصيل",
    value_1_desc:
      "نحن نؤمن بأن التحول الحقيقي يحدث عندما يخاطب العلاج قلبك بلغتك الأم.",
    value_2_title: "نهج قائم على العلم",
    value_2_desc:
      "تجمع أساليبنا بين الحكمة القديمة وعلم الأعصاب الحديث وتقنيات التنويم المغناطيسي القائمة على الأدلة.",
    value_3_title: "حساسية ثقافية",
    value_3_desc:
      "إدراكًا منا بأن الشفاء شخصي وثقافي للغاية، فإننا نكرم الخلفيات واللغات المتنوعة.",
    value_4_title: "تغيير دائم",
    value_4_desc:
      "نحن نركز على إعادة برمجة اللاوعي من أجل تحول دائم، وليس إصلاحات مؤقتة.",
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
      "جعل الشفاء التحويلي متاحًا للمجتمعات المتنوعة من خلال تقديم العلاج بالتنويم المغناطيسي والبرمجة اللغوية العصبية باللغات التي تخاطب قلوبهم. نحن نسد الفجوة بين الحكمة القديمة وعلم الأعصاب الحديث، ونخلق تجربة شفاء تكرم الثقافة والعلم على حد سواء.",
    our_vision: "رؤيتنا",
    our_vision_desc:
      "خلق عالم تتجاوز فيه الصحة العقلية حواجز اللغة، حيث يمكن لكل شخص الوصول إلى الشفاء الذي يحتاجه باللغة التي يشعر بها وكأنها في وطنه. نتصور مجتمعات تلتئم من الداخل، وممكّنة لكسر الأنماط الأجيال وخلق تغيير إيجابي دائم.",
    stat_countries: "الدول التي نخدمها",
    stat_success: "معدل النجاح",
    ready_to_begin: "هل أنت مستعد لبدء تحولك؟",
    ready_to_begin_desc:
      "انضم إلى مجتمع المعالجين لدينا واكتشف قوة التغيير اللاواعي بلغتك الأم.",

    // Sessions Page
    sessions_title: "جلسات التنويم المغناطيسي",
    sessions_desc:
      "غير حياتك من خلال جلسات العلاج بالتنويم المغناطيسي المدعومة علميًا. متوفرة بلغات متعددة لتواصل أعمق وتغيير دائم.",
    all_categories: "جميع الفئات",
    all_languages: "جميع اللغات",
    available_in: "متوفر في:",
    start_session: "ابدأ الجلسة",
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
    book_your_sessions:"अपना सत्र बुक करें",
    watch_video: "वीडियो देखें",
    follow_us: "हमें फॉलो करें",

    // Taglines & Headers
    heal_tagline: "हमारे साथ अपनी आत्मा को चंगा करें।",
    brand_name: "सबकॉन्शस वैली",

    // Homepage
    hero_title:"आज ही अपना अवचेतन मन ट्रेन करें. साँस भी वही चलाता है। पेशेवर ऑडियो आपकी आदतें बदलते है।आपको बस हर रात सुनना है।",
    hero_sub_title_1:"किसी थेरपिस्ट से बात नहीं करनी। ऑडियो खरीदें, प्ले दबाएँ और वेबसाइट से सुनें। साँस अपने-आप चलती है| यही अवचेतन की शक्ति है।",
    hero_sub_title_2:" उसी को ट्रेन करें। सफलता, शांति और कार्रवाई की प्रैक्टिस करें। आज ही एक्सेस लें और बेहतर आदतें बसाइए।",
    hero_title_1: "अपनी कहानी को",
    hero_title_2: "फिर से लिखने की शक्ति",
    hero_subtitle:
      "क्योंकि स्थायी परिवर्तन वहीं से शुरू होता है जहां आपका मन सच में सुनता है - अवचेतन की गहराई में।",
    multilingual_support_desc:
      "गहरे, स्थायी परिवर्तन के लिए बहुभाषी NLP और हिप्नोथेरेपी ऑडियो",
    start_your_transformation: "अपना परिवर्तन शुरू करें",
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
    about_cofounder:"15 वर्षीय सारा एक प्रमाणित एक्सेस बार्स प्रैक्टिशनर हैं, जिन्हें ऊर्जा चिकित्सा और चेतना कार्य में गहरी रुचि है। उन्होंने सबकॉन्शस वैली की ऑडियो सामग्री में सार्थक योगदान दिया है, जो ठोस तकनीकी इनपुट, सौंदर्यशास्त्र की समझ और ध्वनि के भावनात्मक/ऊर्जावान प्रभाव के प्रति संवेदनशीलता के माध्यम से इसके शांत माहौल को आकार देता है। एक युवा निर्माता के रूप में, वह ब्रांड के इस विश्वास को मूर्त रूप देती हैं कि उपचार, जागरूकता और रचनात्मकता उम्र से सीमित नहीं हैं।",
    meet_cofounder:"सारा से मिलें",
    young_visionary:"युवा दूरदर्शी",
    co_founder:"सह-संस्थापक",
    // About Page
    about_hero_title: "चिकित्सा जो बोलती है",
    about_hero_title_2: "आपकी आत्मा से",
    about_hero_desc:
      "सबकॉन्शस वैली एक सरल लेकिन गहरे विश्वास से पैदा हुआ था: सच्चा उपचार तब होता है जब चिकित्सा आपके दिमाग और आपके सांस्कृतिक दिल दोनों से जुड़ती है।",
    story_behind_title: "सबकॉन्शस वैली के पीछे की कहानी",
    story_behind_desc: "हर परिवर्तन एक कहानी से शुरू होता है। यह मेरी है।",
    founder_about_quote:
      "मेरा मानना ​​है कि प्रत्येक व्यक्ति अपने भीतर चंगा करने, बदलने और वास्तव में इच्छित जीवन बनाने की शक्ति रखता है। कभी-कभी, हमें उस शक्ति को अनलॉक करने के लिए बस सही कुंजी की आवश्यकता होती है - और वह कुंजी अक्सर हमारे दिल की भाषा में पाई जाती है।",
    why_multilingual_matters: "बहुभाषी क्यों मायने रखता है",
    why_multilingual_p1:
      "मध्य पूर्व और एशिया भर में विविध पृष्ठभूमि के ग्राहकों के साथ काम करने के बाद, मैंने कुछ उल्लेखनीय देखा: सफलता के क्षण अक्सर तब होते थे जब हम उनकी मातृभाषा में स्विच करते थे। हिंदी सत्रों ने उन भावनाओं को अनलॉक किया जहां तक ​​अंग्रेजी नहीं पहुंच सकती थी। अरबी सम्मोहन सांस्कृतिक मान्यताओं से इस तरह से जुड़ा कि यह प्रामाणिक और शक्तिशाली महसूस हुआ।",
    why_multilingual_p2:
      "इस अहसास ने सबकॉन्शस वैली को प्रेरित किया - मध्य पूर्व और एशिया के विविध समुदायों के लिए विशेष रूप से डिजाइन की गई कई भाषाओं में पेशेवर हिप्नोथेरेपी की पेशकश करने वाला पहला मंच।",
    founder_title: "संस्थापक और प्रमुख व्यवसायी",
    certifications_training: "प्रमाणन और प्रशिक्षण",
    lives_transformed: "जीवन बदल गए",
    across_countries: "कई भाषाओं और 15+ देशों में",
    languages_we_heal_in: "भाषाएँ जिनमें हम उपचार करते हैं",
    many_more: "और भी बहुत कुछ...",
    our_core_values: "हमारे मूल मूल्य",
    core_values_desc:
      "ये सिद्धांत सबकॉन्शस वैली में हम जो कुछ भी करते हैं उसका मार्गदर्शन करते हैं",
    value_1_title: "प्रामाणिक उपचार",
    value_1_desc:
      "हमारा मानना ​​है कि सच्चा परिवर्तन तब होता है जब चिकित्सा आपकी मातृभाषा में आपके दिल से बात करती है।",
    value_2_title: "विज्ञान आधारित दृष्टिकोण",
    value_2_desc:
      "हमारी विधियाँ प्राचीन ज्ञान को आधुनिक तंत्रिका विज्ञान और साक्ष्य-आधारित सम्मोहन चिकित्सा तकनीकों के साथ जोड़ती हैं।",
    value_3_title: "सांस्कृतिक संवेदनशीलता",
    value_3_desc:
      "यह समझते हुए कि उपचार अत्यंत व्यक्तिगत और सांस्कृतिक है, हम विविध पृष्ठभूमि और भाषाओं का सम्मान करते हैं।",
    value_4_title: "स्थायी परिवर्तन",
    value_4_desc:
      "हम स्थायी परिवर्तन के लिए अवचेतन पुन: प्रोग्रामिंग पर ध्यान केंद्रित करते हैं, अस्थायी सुधारों पर नहीं।",
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
      "विविध समुदायों के लिए परिवर्तनकारी उपचार सुलभ बनाना, उनके दिलों से बात करने वाली भाषाओं में पेशेवर सम्मोहन चिकित्सा और एनएलपी प्रदान करके। हम प्राचीन ज्ञान और आधुनिक तंत्रिका विज्ञान के बीच की खाई को पाटते हैं, एक उपचार अनुभव बनाते हैं जो संस्कृति और विज्ञान दोनों का सम्मान करता है।",
    our_vision: "हमारी दृष्टि",
    our_vision_desc:
      "एक ऐसी दुनिया बनाना जहां मानसिक स्वास्थ्य भाषा की बाधाओं को पार कर जाए, जहां हर व्यक्ति अपनी घरेलू भाषा में आवश्यक उपचार प्राप्त कर सके। हम भीतर से ठीक हुए समुदायों की कल्पना करते हैं, जो पीढ़ीगत पैटर्न को तोड़ने और स्थायी सकारात्मक बदलाव लाने के लिए सशक्त हैं।",
    stat_countries: "सेवा प्रदान किए गए देश",
    stat_success: "सफलता दर",
    ready_to_begin: "क्या आप अपना परिवर्तन शुरू करने के लिए तैयार हैं?",
    ready_to_begin_desc:
      "हमारे चिकित्सकों के समुदाय में शामिल हों और अपनी मातृभाषा में अवचेतन परिवर्तन की शक्ति की खोज करें।",

    // Sessions Page
    sessions_title: "सम्मोहन सत्र",
    sessions_desc:
      "हमारे वैज्ञानिक रूप से समर्थित सम्मोहन चिकित्सा सत्रों के साथ अपने जीवन को बदलें। गहरे संबंध और स्थायी परिवर्तन के लिए कई भाषाओं में उपलब्ध है।",
    all_categories: "सभी श्रेणियाँ",
    all_languages: "सभी भाषाएँ",
    available_in: "में उपलब्ध:",
    start_session: "सत्र शुरू करें",
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
