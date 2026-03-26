import { Moon, Code, BookOpen, Music, Coffee } from 'lucide-react'

export const HABITS = [
  {
    id: 'sleep',
    name: 'Sleep',
    unit: 'hours',
    icon: Moon,
    color: '#7b2ff7',
    section: 'Rest',
  },
  {
    id: 'code',
    name: 'Lines of Code',
    unit: 'lines',
    icon: Code,
    color: '#4cc9f0',
    section: 'Code',
  },
  {
    id: 'articles',
    name: 'Articles Read',
    unit: 'articles',
    icon: BookOpen,
    color: '#4ade80',
    section: 'Learning',
  },
  {
    id: 'dance',
    name: 'Dance Practice',
    unit: 'min',
    icon: Music,
    color: '#f72585',
    section: 'Movement',
  },
  {
    id: 'coffee_chats',
    name: 'Coffee Chats',
    unit: 'chats',
    icon: Coffee,
    color: '#fb923c',
    section: 'Social',
  },
]
