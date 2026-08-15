import { Routes } from '@angular/router';

import { HomePage } from '../../../../views/public/home-page/home-page';
import { FindWork } from '../../../../views/public/find-work/find-work';
import { HireTalent } from '../../../../views/public/hire-talent/hire-talent';
import { WhyTalentHub } from '../../../../views/public/why-talent-hub/why-talent-hub';
import { AboutUs } from '../../../../views/public/about-us/about-us';
import { Blog } from '../../../../views/public/blog/blog';
import { BlogDetails } from '../../../../views/public/blog-details/blog-details';

export const PUBLIC_ROUTES: Routes = [
  { path: '', component: HomePage },
  { path: 'find-work', component: FindWork },
  { path: 'hire-talent', component: HireTalent },
  { path: 'why-talent-hub', component: WhyTalentHub },
  { path: 'about-us', component: AboutUs },
  { path: 'blog', component: Blog },
  { path: 'blog-details', component: BlogDetails }
];
