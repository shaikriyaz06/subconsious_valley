// Blog Post Schema and Sample Data
export const blogPosts = [
  {
    id: "68b46834cee8741d91765439",
    title: "Is Hypnotherapy Real? Busting the Myths with Science and History",
    slug: "is-hypnotherapy-real-busting-myths-science-history",
    content: `Hypnotherapy often carries a cloud of mystery and misunderstanding. When many people hear "hypnosis," they picture stage shows, mind control, or magical tricks. But the reality is far from these stereotypes.

## The Ancient Origins of Hypnotherapy

Did you know that practices similar to hypnosis have existed for thousands of years? Ancient civilizations — including the Egyptians, Greeks, and Indians — used trance-like states for healing, spiritual journeys, and mental transformation.

## Myth 1: Hypnosis is Mind Control

One of the biggest misconceptions is that hypnotherapy lets someone else take control of your mind — that you lose your free will and can be forced to do things against your wishes.

**The truth:** During hypnotherapy, you are fully aware and in control at all times. Hypnosis is a state of focused relaxation, like being deeply absorbed in a book or movie.`,
    excerpt: "Hypnotherapy often carries a cloud of mystery and misunderstanding. Let's clear up the most common myths and explore why hypnotherapy works with science and ancient wisdom.",
    featured_image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    tags: ["hypnotherapy", "science", "myths", "healing"],
    published: true,
    read_time: 7,
    created_date: "2025-08-31T15:20:20.132000"
  },
  {
    id: "68b46834cee8741d9176543a",
    title: "The Subconscious Mind: Your Hidden Superpower",
    slug: "subconscious-mind-hidden-superpower",
    content: `When we think about our mind, most of us imagine the thoughts we have during the day — the conscious mind that directs our actions, makes decisions, and plans for the future.

## What is the Subconscious Mind?

The subconscious is like the hard drive of your brain. It stores every experience, belief, memory, and emotion you've ever had — even those you aren't aware of.

## How Can You Harness This Power?

Here's the exciting part: the subconscious mind is reprogrammable. Through focused techniques like hypnotherapy, you can gently replace limiting beliefs with empowering ones.`,
    excerpt: "Discover the mysterious force that shapes 95% of who you are and how you behave.",
    featured_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    tags: ["subconscious mind", "psychology", "transformation"],
    published: true,
    read_time: 6,
    created_date: "2025-08-31T15:20:20.132000"
  }
];

export const getBlogPosts = () => blogPosts.filter(post => post.published);
export const getBlogPost = (slug) => blogPosts.find(post => post.slug === slug);