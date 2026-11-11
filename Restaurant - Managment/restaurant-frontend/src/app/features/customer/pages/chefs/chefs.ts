
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Chef {
  id: number;
  name: string;
  role: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  description: string;
}

@Component({
  selector: 'app-chefs',
  imports: [RouterLink],
  templateUrl: './chefs.html',
  styleUrl: './chefs.scss',
})
export class Chefs {
  chefs: Chef[] = [
    {
      id: 1,
      name: 'James Anderson',
      role: 'Head Chef',
      specialty: 'International Cuisine',
      experience: 12,
      rating: 4.9,
      image:
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=85',
      description:
        'Passionate about creating unforgettable dishes using fresh ingredients and modern cooking techniques.',
    },
    {
      id: 2,
      name: 'Sophia Martinez',
      role: 'Pastry Chef',
      specialty: 'Desserts & Pastries',
      experience: 9,
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=800&auto=format&fit=crop&q=85',
      description:
        'Creates beautiful desserts combining traditional recipes with creative flavors and elegant presentation.',
    },
    {
      id: 3,
      name: 'Daniel Roberts',
      role: 'Pizza Chef',
      specialty: 'Italian Cuisine',
      experience: 10,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Dedicated to authentic Italian flavors, handmade dough, and perfectly baked pizzas.',
    }
    ,
    {
      id: 4,
      name: 'Olivia Wilson',
      role: 'Sous Chef',
      specialty: 'Healthy Cuisine',
      experience: 7,
      rating: 4.7,
      image:
        'https://images.unsplash.com/photo-1595257841889-eca2678454e2?w=800&auto=format&fit=crop&q=85',
      description:
        'Creates balanced and nutritious meals without compromising on taste or presentation.',
    },
  ];

  get totalChefs(): number {
    return this.chefs.length;
  }

  get averageExperience(): number {
    const total = this.chefs.reduce((sum, chef) => sum + chef.experience, 0);

    return Math.round(total / this.chefs.length);
  }
}
