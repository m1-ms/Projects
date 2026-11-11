import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PopularCategories } from '../../components/popular-categories/popular-categories';
import { FeaturedDishes } from '../../components/featured-dishes/featured-dishes';
import { WhyChooseUs } from '../../components/why-choose-us/why-choose-us';
import { Testimonials } from '../../components/testimonials/testimonials';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PopularCategories, FeaturedDishes, WhyChooseUs, Testimonials, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
