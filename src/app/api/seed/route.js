import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import Session from '@/models/Session'
import Purchase from '@/models/Purchase'
import SessionBooking from '@/models/SessionBooking'
import User from '@/models/User'

export async function GET() {
  try {
    await dbConnect()

    // Clear mongoose model cache to ensure updated schema is used
    delete mongoose.models.Session
    
    // Clear existing data (old and new models)
    await Session.deleteMany({})
    await Purchase.deleteMany({})
    await SessionBooking.deleteMany({})
    


    // Create parent sessions with child sessions
    const sessionData = [
      // {
      //   title: "Test Pricing Session",
      //   category: "confidence",
      //   price: 100,
      //   original_price: 150,
      //   discount_percentage: 33,
      //   currency: "AED",
      //   languages: ["english"],
      //   required_plan: "basic",
      //   created_by: "Admin",
      //   parent_id: null
      // },
      // {
      //   title: "Anxiety Relief Master Course",
      //   description: "Complete 7-day anxiety transformation program with guided sessions",
      //   category: "anxiety",
      //   price: 29.99,
      //   languages: ["english", "hindi"],
      //   preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
      //   required_plan: "basic",
      //   image_url: "https://example.com/anxiety-course.jpg",
      //   created_by: "Admin",
      //   parent_id: null,
      //   child_sessions: [
      //     {
      //       title: "Day 1: Understanding Anxiety",
      //       description: "Learn the root causes of anxiety",
      //       duration: 20,
      //       audio_urls: {
      //         english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
      //         hindi: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //       },
      //       image_url: "https://example.com/day1.jpg",
      //       order: 1
      //     },
      //     {
      //       title: "Day 2: Breathing Techniques",
      //       description: "Master calming breath work",
      //       duration: 25,
      //       audio_urls: {
      //         english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
      //         hindi: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //       },
      //       image_url: "https://example.com/day2.jpg",
      //       order: 2
      //     },
      //     {
      //       title: "Day 3: Mindful Meditation",
      //       description: "Deep relaxation and mindfulness",
      //       duration: 30,
      //       audio_urls: {
      //         english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //       },
      //       image_url: "https://example.com/day3.jpg",
      //       order: 3
      //     }
      //   ]
      // },
      // {
      //   title: "Free Anxiety Relief Session",
      //   description: "Quick anxiety relief technique - completely free",
      //   category: "anxiety",
      //   price: 0,
      //   duration: 15,
      //   languages: ["english"],
      //   audio_urls: {
      //     english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //   },
      //   preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
      //   required_plan: "free",
      //   image_url: "https://example.com/free-session.jpg",
      //   created_by: "Admin",
      //   parent_id: null,
      //   is_sample: true
      // },
      // {
      //   title: "Confidence Building Bootcamp",
      //   description: "5-session intensive confidence building program",
      //   category: "confidence",
      //   price: 49.99,
      //   languages: ["english"],
      //   preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
      //   required_plan: "premium",
      //   image_url: "https://example.com/confidence-bootcamp.jpg",
      //   created_by: "Admin",
      //   parent_id: null,
      //   child_sessions: [
      //     {
      //       title: "Session 1: Self-Worth Foundation",
      //       description: "Build your core self-worth",
      //       duration: 35,
      //       audio_urls: {
      //         english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //       },
      //       image_url: "https://example.com/confidence1.jpg",
      //       order: 1
      //     },
      //     {
      //       title: "Session 2: Inner Strength",
      //       description: "Discover your inner power",
      //       duration: 40,
      //       audio_urls: {
      //         english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //       },
      //       image_url: "https://example.com/confidence2.jpg",
      //       order: 2
      //     }
      //   ]
      // },
      {
        title: "Body Confidence Collection",
        description: "Weightless Transformation Package - Group of 5 products. A comprehensive hypnosis journey to reshape your relationship with food, cravings, and exercise. Achieve lasting healthy weight loss with gentle mindset shifts and deep subconscious reprogramming.",
        category: "confidence",
        original_price: 300,
        price: 210,
        discount_percentage: 30,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/body-confidence.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Mindful Plate - Healthy Choices Hypnosis",
            description: "Train your mind to naturally choose nourishing, wholesome foods that support your wellness goals without feeling deprived.",
            duration: 30,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/mindful-plate.jpg",
            order: 1
          },
          {
            title: "Binge-Free Mindset",
            description: "Break free from emotional overeating and regain control over your eating habits with this powerful session.",
            duration: 28,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/binge-free.jpg",
            order: 2
          },
          {
            title: "Calorie Calm - Mindful Eating Reset",
            description: "Tune into your body's true hunger signals to manage portions effortlessly and eat with awareness.",
            duration: 25,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/calorie-calm.jpg",
            order: 3
          },
          {
            title: "Move More Motivation",
            description: "Discover your inner drive to enjoy physical activity daily and build a joyful exercise routine.",
            duration: 32,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/move-more.jpg",
            order: 4
          },
          {
            title: "Sugar Freedom Session",
            description: "Reduce sugar cravings naturally and restore balanced energy levels throughout your day.",
            duration: 27,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/sugar-freedom.jpg",
            order: 5
          }
        ]
      },
      {
        title: "SLIMBAND EXPERIENCE",
        description: "A safe, non-surgical hypnosis program that simulates the feeling of gastric band surgery, helping you feel full sooner and eat less.",
        category: "healing",
        original_price: 399,
        price: 279, // 30% discount
        discount_percentage: 30,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/slimband-experience.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Weightless Transformation Package",
            description: "A comprehensive hypnosis journey to reshape your relationship with food, cravings, and exercise. Achieve lasting healthy weight loss with gentle mindset shifts and deep subconscious reprogramming.",
            duration: 35,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/weightless-transformation.jpg",
            order: 1
          },
          {
            title: "Mindful Plate - Healthy Choices Hypnosis",
            description: "Train your mind to naturally choose nourishing, wholesome foods that support your wellness goals without feeling deprived.",
            duration: 30,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/mindful-plate-slim.jpg",
            order: 2
          },
          {
            title: "Binge-Free Mindset",
            description: "Break free from emotional overeating and regain control over your eating habits with this powerful session.",
            duration: 28,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/binge-free-slim.jpg",
            order: 3
          },
          {
            title: "Calorie Calm - Mindful Eating Reset",
            description: "Tune into your body's true hunger signals to manage portions effortlessly and eat with awareness.",
            duration: 25,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/calorie-calm-slim.jpg",
            order: 4
          },
          {
            title: "Move More Motivation",
            description: "Discover your inner drive to enjoy physical activity daily and build a joyful exercise routine.",
            duration: 32,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/move-more-slim.jpg",
            order: 5
          },
          {
            title: "Sugar Freedom Session",
            description: "Reduce sugar cravings naturally and restore balanced energy levels throughout your day.",
            duration: 27,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/sugar-freedom-slim.jpg",
            order: 6
          }
        ]
      },
      {
        title: "SLIMBOOST INJECTION THERAPY",
        description: "Harness the power of virtual injections through hypnosis to accelerate fat burning, curb cravings, and boost motivation - 6 products.",
        category: "healing",
        original_price: 399,
        price: 279, // 30% discount
        discount_percentage: 30,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/slimboost-injection.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Weightless Transformation Package",
            description: "A comprehensive hypnosis journey to reshape your relationship with food, cravings, and exercise. Achieve lasting healthy weight loss with gentle mindset shifts and deep subconscious reprogramming.",
            duration: 35,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/weightless-transformation-boost.jpg",
            order: 1
          },
          {
            title: "Mindful Plate - Healthy Choices Hypnosis",
            description: "Train your mind to naturally choose nourishing, wholesome foods that support your wellness goals without feeling deprived.",
            duration: 30,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/mindful-plate-boost.jpg",
            order: 2
          },
          {
            title: "Binge-Free Mindset",
            description: "Break free from emotional overeating and regain control over your eating habits with this powerful session.",
            duration: 28,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/binge-free-boost.jpg",
            order: 3
          },
          {
            title: "Calorie Calm - Mindful Eating Reset",
            description: "Tune into your body's true hunger signals to manage portions effortlessly and eat with awareness.",
            duration: 25,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/calorie-calm-boost.jpg",
            order: 4
          },
          {
            title: "Move More Motivation",
            description: "Discover your inner drive to enjoy physical activity daily and build a joyful exercise routine.",
            duration: 32,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/move-more-boost.jpg",
            order: 5
          },
          {
            title: "Sugar Freedom Session",
            description: "Reduce sugar cravings naturally and restore balanced energy levels throughout your day.",
            duration: 27,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/sugar-freedom-boost.jpg",
            order: 6
          }
        ]
      },
      {
        title: "Self-Love Collection",
        description: "Glow Within - Self-Love Boost. Rebuild your self-worth and cultivate deep self-compassion, empowering you to live confidently and authentically. Includes free meditation session.",
        category: "confidence",
        price: 109,
        discount_percentage: 0,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/self-love-collection.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Glow Within - Self-Love Boost",
            description: "Rebuild your self-worth and cultivate deep self-compassion, empowering you to live confidently and authentically.",
            duration: 35,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/glow-within.jpg",
            order: 1
          },
          {
            title: "Inner Critic Silencer",
            description: "Transform your inner dialogue from criticism to compassion and build unshakeable self-acceptance.",
            duration: 30,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/inner-critic.jpg",
            order: 2
          },
          {
            title: "Authentic Self Expression",
            description: "Embrace your true self and express your authentic personality with confidence and grace.",
            duration: 32,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/authentic-self.jpg",
            order: 3
          },
          {
            title: "Self-Compassion Mastery",
            description: "Learn to treat yourself with the same kindness you show others and develop lasting self-compassion.",
            duration: 28,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/self-compassion.jpg",
            order: 4
          },
          {
            title: "Confidence From Within",
            description: "Build unshakeable confidence that comes from deep self-acceptance and inner strength.",
            duration: 33,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/confidence-within.jpg",
            order: 5
          }
        ]
      },
      {
        title: "Emotional Healing Collection",
        description: "Complete emotional healing package with sessions for depression relief, trauma release, stress management, and anxiety reset - group of 4.",
        category: "healing",
        price: 249,
        discount_percentage: 0,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/emotional-healing-collection.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Depression Relief Session",
            description: "Gently release the heaviness of depression and invite renewed hope, joy, and emotional balance.",
            duration: 40,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/depression-relief.jpg",
            order: 1
          },
          {
            title: "Trauma Release Session",
            description: "Heal old wounds and free yourself from the emotional pain of past traumas through guided subconscious work.",
            duration: 45,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/trauma-release.jpg",
            order: 2
          },
          {
            title: "Stress Release Hypnotherapy",
            description: "Dissolve tension and anxiety, creating space for calmness and mental clarity.",
            duration: 35,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/stress-release.jpg",
            order: 3
          },
          {
            title: "Anxiety Reset Session",
            description: "Shift anxious patterns and restore peace of mind with focused relaxation techniques.",
            duration: 30,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/anxiety-reset.jpg",
            order: 4
          }
        ]
      },
      {
        title: "CalmMind Collection",
        description: "Comprehensive mindfulness and productivity package featuring emotional healing, fear management, household motivation, and procrastination release.",
        category: "focus",
        original_price: 220,
        price: 154, // 30% discount
        discount_percentage: 30,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/calmmind-collection.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Emotional Healing Journey (Coming soon)",
            description: "Support emotional resilience and healing through soothing hypnosis designed to nurture your inner self.",
            duration: 0,
            audio_urls: {
              english: ""
            },
            image_url: "https://example.com/emotional-journey.jpg",
            order: 1,
            coming_soon: true
          },
          {
            title: "Fear & Anxiety Reset (Coming soon)",
            description: "Overcome fear responses and anxious thoughts to feel grounded and safe.",
            duration: 0,
            audio_urls: {
              english: ""
            },
            image_url: "https://example.com/fear-anxiety-reset.jpg",
            order: 2,
            coming_soon: true
          },
          {
            title: "Roots & Rhythm (House Chores Motivation)",
            description: "Transform everyday chores into energizing, mindful practices that uplift your home life.",
            duration: 25,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/roots-rhythm.jpg",
            order: 3
          },
          {
            title: "Momentum Shift (Procrastination Release)",
            description: "Break the cycle of delay and hesitation, tapping into sustained motivation and productivity.",
            duration: 30,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/momentum-shift.jpg",
            order: 4
          }
        ]
      },
      {
        title: "Freedom Path Collection",
        description: "Addiction recovery and digital wellness package featuring alcohol aversion therapy, smoking cessation, and digital detox support. Includes free meditation, procrastination and self love sessions (introductory price).",
        category: "healing",
        price: 249,
        discount_percentage: 0,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/freedom-path-collection.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Sober Freedom Journey - Alcohol Aversion & Healing",
            description: "Empower yourself to overcome alcohol cravings and embrace a healthier, freer lifestyle.",
            duration: 45,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/sober-freedom.jpg",
            order: 1
          },
          {
            title: "Smoking Cessation (Coming Soon)",
            description: "Prepare to quit smoking with hypnosis support designed to ease withdrawal and build lasting habits.",
            duration: 0,
            audio_urls: {
              english: ""
            },
            image_url: "https://example.com/smoking-cessation.jpg",
            order: 2,
            coming_soon: true
          },
          {
            title: "Digital Detox Reset (Coming Soon)",
            description: "Reset your relationship with technology and cultivate mindful digital habits.",
            duration: 0,
            audio_urls: {
              english: ""
            },
            image_url: "https://example.com/digital-detox.jpg",
            order: 3,
            coming_soon: true
          }
        ]
      },
      {
        title: "Restful Nights",
        description: "Dream Drift Sleep Hypnotherapy - Experience deeper, more restful sleep and wake up refreshed and rejuvenated.",
        category: "sleep",
        price: 99,
        discount_percentage: 0,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "basic",
        image_url: "https://example.com/restful-nights.jpg",
        created_by: "Admin",
        parent_id: null,
        duration: 40,
        audio_urls: {
          english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
        }
      },
      {
        title: "Bright Minds Collection",
        description: "Comprehensive children's development package featuring confidence building, study focus, and sleep support for kids and teens. Single product AED 99, group of 4 - AED 150.",
        category: "confidence",
        price: 150,
        discount_percentage: 0,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "premium",
        image_url: "https://example.com/bright-minds-collection.jpg",
        created_by: "Admin",
        parent_id: null,
        child_sessions: [
          {
            title: "Confident Me - Kids Edition",
            description: "Help your child build self-confidence and emotional strength in a gentle, supportive way reducing anxiety and stress.",
            duration: 25,
            audio_urls: {
              english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
            },
            image_url: "https://example.com/confident-me-kids.jpg",
            order: 1
          },
          {
            title: "Study Focus Boost - Kids and Teens Edition (Coming soon)",
            description: "Enhance concentration and motivation for better academic performance.",
            duration: 0,
            audio_urls: {
              english: ""
            },
            image_url: "https://example.com/study-focus-kids.jpg",
            order: 2,
            coming_soon: true
          },
          {
            title: "Kids Sleep Magic (Coming soon)",
            description: "Create peaceful bedtime routines for children to enjoy restful sleep.",
            duration: 0,
            audio_urls: {
              english: ""
            },
            image_url: "https://example.com/kids-sleep-magic.jpg",
            order: 3,
            coming_soon: true
          }
        ]
      },
      {
        title: "Memory Mastery Session",
        description: "Boost your memory retention and recall skills with targeted hypnosis techniques for sharper mental performance.",
        category: "focus",
        price: 99,
        discount_percentage: 0,
        currency: "AED",
        languages: ["english"],
        preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
        required_plan: "basic",
        image_url: "https://example.com/memory-mastery.jpg",
        created_by: "Admin",
        parent_id: null,
        duration: 35,
        audio_urls: {
          english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
        }
      },
      // {
      //   title: "Freedom from Delay (Antidote for Procrastination)",
      //   description: "Break free from procrastination patterns and unlock your productivity potential. Includes meditation session.",
      //   category: "focus",
      //   price: 149,
      //   discount_percentage: 0,
      //   currency: "AED",
      //   languages: ["english"],
      //   preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
      //   required_plan: "basic",
      //   image_url: "https://example.com/freedom-from-delay.jpg",
      //   created_by: "Admin",
      //   parent_id: null,
      //   duration: 35,
      //   audio_urls: {
      //     english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //   }
      // },
      // {
      //   title: "House Chores Hero",
      //   description: "Transform your relationship with household tasks and find motivation to maintain a clean, organized home environment.",
      //   category: "focus",
      //   price: 99,
      //   discount_percentage: 0,
      //   currency: "AED",
      //   languages: ["english"],
      //   preview_url: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg",
      //   required_plan: "basic",
      //   image_url: "https://example.com/house-chores-hero.jpg",
      //   created_by: "Admin",
      //   parent_id: null,
      //   duration: 30,
      //   audio_urls: {
      //     english: "C:/Users/shaik/OneDrive/Desktop/My_Projects/subconsiousvalley/public/audio/music.ogg"
      //   }
      // }
    ];
    
    console.log('Sample session data:', JSON.stringify(sessionData[0], null, 2));
    const sessions = await Session.insertMany(sessionData);
    console.log('First created session:', JSON.stringify(sessions[0], null, 2));

    // Create purchases for parent sessions
    await Purchase.insertMany([
      {
        session_id: sessions[0]._id.toString(), // Anxiety Master Course
        session_title: "Anxiety Relief Master Course",
        user_email: "shaikmohammedriyaz222@gmail.com",
        user_name: "Mohammed Riyaz",
        amount_paid: 29.99,
        currency: "USD",
        payment_status: "completed",
        stripe_payment_intent_id: "pi_test_" + Date.now(),
        access_granted: true
      },
      {
        session_id: sessions[1]._id.toString(), // Free session
        session_title: "Free Anxiety Relief Session",
        user_email: "shaikmohammedriyaz222@gmail.com",
        user_name: "Mohammed Riyaz",
        amount_paid: 0,
        currency: "USD",
        payment_status: "completed",
        stripe_payment_intent_id: "pi_free_" + Date.now(),
        access_granted: true
      }
    ])

    // Create session bookings
    await SessionBooking.insertMany([
      {
        session_id: sessions[2]._id.toString(), // Confidence Bootcamp
        session_title: "Confidence Building Bootcamp",
        user_email: "shaikmohammedriyaz222@gmail.com",
        user_name: "Mohammed Riyaz",
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "confirmed",
        language_preference: "english",
        notes: "Ready for confidence transformation",
        payment_status: "paid",
        amount_paid: 49.99
      },
      {
        session_id: sessions[0]._id.toString(), // Anxiety Course
        session_title: "Anxiety Relief Master Course",
        user_email: "test@example.com",
        user_name: "Test User",
        scheduled_date: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: "pending",
        language_preference: "hindi",
        notes: "Need help with anxiety",
        payment_status: "pending",
        amount_paid: 29.99
      }
    ])

    return Response.json({ 
      message: 'Database seeded successfully',
      sessions: sessions.length,
      purchases: 2,
      bookings: 2
    })

  } catch (error) {
    console.error('Seeding error:', error)
    return Response.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}