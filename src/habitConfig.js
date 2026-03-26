import { Moon, BookOpen, Music, Coffee, Shirt, Waves, Dumbbell } from 'lucide-react'

export const CATEGORIES = ['Health', 'Hobbies', 'Learning']

export const HABITS = [
  {
    id: 'sleep',
    name: 'Sleep',
    unit: 'hours',
    icon: Moon,
    color: '#7b2ff7',
    category: 'Health',
  },
  {
    id: 'solidcore',
    name: '[solidcore]',
    unit: 'sessions',
    icon: Dumbbell,
    color: '#f43f5e',
    category: 'Health',
  },
  {
    id: 'dance',
    name: 'Dance Practice',
    unit: 'min',
    icon: Music,
    color: '#f72585',
    category: 'Hobbies',
  },
  {
    id: 'fit_checks',
    name: 'Fit Checks',
    unit: 'fits',
    icon: Shirt,
    color: '#facc15',
    category: 'Hobbies',
  },
  {
    id: 'kayaking',
    name: 'Kayaking',
    unit: 'voyages',
    icon: Waves,
    color: '#4cc9f0',
    category: 'Hobbies',
  },
  {
    id: 'articles',
    name: 'Articles Read',
    unit: 'articles',
    icon: BookOpen,
    color: '#4ade80',
    category: 'Learning',
  },
  {
    id: 'coffee_chats',
    name: 'Coffee Chats',
    unit: 'chats',
    icon: Coffee,
    color: '#fb923c',
    category: 'Learning',
  },
]
