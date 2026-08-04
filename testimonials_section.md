<!-- See the challenge on Frontend Mentor:

https://www.frontendmentor.io/challenges/testimonials-grid-section-Nnw6J7Un7 -->

<div class="container">
  <section id="testimonials">
    <figure class="testimonial daniel">
      <figcaption>
        <img src="https://github.com/annafkt/frontend-mentor-challenges/blob/main/challenges/testimonials-grid-section/images/image-daniel.jpg?raw=true" alt="" width="35">
        <p class="name">Daniel Clifford</p>
        <p class="title">Verified Graduate</p>
      </figcaption>
      <blockquote>
        <h3 class="quote-part-1">I received a job offer mid-course, and the subjects I learned were current, if not more so, in the company I joined. I honestly feel I got every penny’s worth.</h3>
        <p class="quote-part-2">“I was an EMT for many years before I joined the bootcamp. I’ve been looking to make a transition and have heard some people who had an amazing experience here. I signed up for the free intro course and found it incredibly fun! I enrolled shortly thereafter. The next 12 weeks was the best - and most grueling - time of my life. Since completing the course, I’ve successfully switched careers, working as a Software Engineer at a VR startup.”</p>
      </blockquote>
    </figure>
    <figure class="testimonial jonathan">
      <figcaption>
        <img src="https://github.com/annafkt/frontend-mentor-challenges/blob/main/challenges/testimonials-grid-section/images/image-jonathan.jpg?raw=true" alt="" width="35">
        <p class="name">Jonathan Walters</p>
        <p class="title">Verified Graduate</p>
      </figcaption>
      <blockquote>
        <h3 class="quote-part-1">The team was very supportive and kept me motivated</h3>
        <p class="quote-part-2">“I started as a total newbie with virtually no coding skills. I now work as a mobile engineer for a big company. This was one of the best investments I’ve made in myself.”</p>
      </blockquote>
    </figure>
    <figure class="testimonial jeanette">
      <figcaption>
        <img src="https://github.com/annafkt/frontend-mentor-challenges/blob/main/challenges/testimonials-grid-section/images/image-jeanette.jpg?raw=true" alt="" width="35">
        <p class="name">Jeanette Harmon</p>
        <p class="title">Verified Graduate</p>
      </figcaption>
      <blockquote>
        <h3 class="quote-part-1">An overall wonderful and rewarding experience</h3>
        <p class="quote-part-2">“Thank you for the wonderful experience! I now have a job I really enjoy, and make a good living while doing something I love.”</p>
      </blockquote>
    </figure>
    <figure class="testimonial patrick">
      <figcaption>
        <img src="https://github.com/annafkt/frontend-mentor-challenges/blob/main/challenges/testimonials-grid-section/images/image-patrick.jpg?raw=true" alt="" width="35">
        <p class="name">Patrick Abrams</p>
        <p class="title">Verified Graduate</p>
      </figcaption>
      <blockquote>
        <h3 class="quote-part-1">Awesome teaching support from TAs who did the bootcamp themselves. Getting guidance from them and learning from their experiences was easy.</h3>
        <p class="quote-part-2">“The staff seem genuinely concerned about my progress which I find really refreshing. The program gave me the confidence necessary to be able to go out in the world and present myself as a capable junior developer. The standard is above the rest. You will get the personal attention you need from an incredible community of smart and amazing people.”</p>
      </blockquote>
    </figure>
    <figure class="testimonial kira">
      <figcaption>
        <img src="https://github.com/annafkt/frontend-mentor-challenges/blob/main/challenges/testimonials-grid-section/images/image-kira.jpg?raw=true" alt="" width="35">
        <p class="name">Kira Whittle</p>
        <p class="title">Verified Graduate</p>
      </figcaption>
      <blockquote>
        <h3 class="quote-part-1">Such a life-changing experience. Highly recommended!</h3>
        <p class="quote-part-2">“Before joining the bootcamp, I’ve never written a line of code. I needed some structure from professionals who can help me learn programming step by step. I was encouraged to enroll by a former student of theirs who can only say wonderful things about the program. The entire curriculum and staff did not disappoint. They were very hands-on and I never had to wait long for assistance. The agile team project, in particular, was outstanding. It took my learning to the next level in a way that no tutorial could ever have. In fact, I’ve often referred to it during interviews as an example of my developent experience. It certainly helped me land a job as a full-stack developer after receiving multiple offers. 100% recommend!”</p>
      </blockquote>
    </figure>
  </section>
  
  <footer class="attribution">
    <p>Challenge by <a href="https://www.frontendmentor.io/challenges/testimonials-grid-section-Nnw6J7Un7" target="_blank">Frontend&nbsp;Mentor</a>.</p>
    <p>Coded by <a href="https://github.com/annafkt/frontend-mentor-challenges/tree/main/challenges/testimonials-grid-section" target="_blank">annafkt</a>.</p>
  </footer>
</div>



@import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600&display=swap');

$white: hsl(0, 0%, 100%);
$light-gray: hsl(0, 0%, 81%);
$light-grayish-blue: hsl(210, 46%, 95%);
$very-dark-grayish-blue: hsl(217, 19%, 35%);
$very-dark-blackish-blue: hsl(219, 29%, 14%);
$moderate-violet: hsl(263, 55%, 52%);

$bg-colors: $moderate-violet,
            $very-dark-grayish-blue,
            $white,
            $very-dark-blackish-blue,
            $white;

$small-screen: 35.65rem;
$medium-screen: 53.35rem;
$lr-screen: 75rem;

$quotation-img: url("data:image/svg+xml,%3Csvg width='104' height='102' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M104 102V59.727H84.114c0-5.871.689-11.182 2.068-15.933 1.379-4.75 3.42-9.287 6.125-13.61C95.01 25.86 98.909 22.257 104 19.375V0c-9.758 4.27-17.712 9.874-23.864 16.813-6.151 6.939-10.712 14.545-13.681 22.818C63.485 47.904 62 59.941 62 75.74V102h42zm-62 0V59.727H22.114c0-5.871.689-11.182 2.068-15.933 1.379-4.75 3.42-9.287 6.125-13.61C33.01 25.86 36.909 22.257 42 19.375V0c-9.652 4.27-17.58 9.874-23.784 16.813C12.01 23.752 7.424 31.358 4.455 39.631 1.485 47.904 0 59.941 0 75.74V102h42z' fill='%23A775F1' fill-rule='nonzero'/%3E%3C/svg%3E");

body {
  min-height: 100vh;
  display: grid;
  justify-content: center;
  align-items: center;
  background-color: $light-grayish-blue;
  font-size: 0.85rem;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 500;
  padding: 1.7rem 1.7rem 0;
}

@for $i from 1 through length($bg-colors) {
  .testimonial:nth-child(#{$i}) {
    background-color: nth($bg-colors, $i);
  }
}

#testimonials {
  display: inline-grid;
  gap: 1.45rem;
  grid-template-columns: 1fr;
  grid-template-areas: "daniel" 
                       "jonathan" 
                       "jeanette" 
                       "patrick" 
                       "kira";

  @media (min-width: $small-screen) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "daniel daniel"
                         "jonathan jeanette"
                         "patrick patrick"
                         "kira kira";
  }

  @media (min-width: $medium-screen) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: "daniel daniel jonathan"
                         "jeanette patrick patrick"
                         "kira kira kira";
  }

  @media (min-width: $lr-screen) {
    grid-template-columns: repeat(4, 16.25rem);
    grid-template-areas: "daniel daniel jonathan kira"
                         "jeanette patrick patrick kira";
  }
}

.testimonial {
  padding: 1.6rem;
  border-radius: 0.5rem;
  box-shadow: 0.625rem 0.625rem 0.625rem rgba($light-gray, 50%);

  figcaption{
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.2rem 1.2rem;

    img {
      grid-area: 1 / 1 / 3 / 2;
      align-self: center;
      width: 2.1875rem;
      height: auto;
      border-radius: 50%;
    }
    
    .name {
      align-self: end;
      font-weight: 600;
    }
  }

  .quote-part-1 {
    font-size: 1.4rem;
    line-height: 1.3em;
    margin: 1.5rem 0;
  }

  .quote-part-2 {
    line-height: 1.5em;
  }
}

.testimonial.daniel {
  background-image: $quotation-img;
  background-repeat: no-repeat;
  background-position: 95% 0%;
  grid-area: daniel;
}

.testimonial.jonathan {
  grid-area: jonathan;
}

.testimonial.jeanette {
  grid-area: jeanette;
}

.testimonial.patrick {
  grid-area: patrick;
}

.testimonial.kira {
  grid-area: kira;
}

.testimonial.daniel,
.testimonial.jonathan,
.testimonial.patrick {

  .name { color: $light-gray; }
  .title { color: rgba($light-gray, 50%); }
  .quote-part-1 { color: $white; }
  .quote-part-2 { color: rgba($light-gray, 70%); }
}

.testimonial.jeanette,
.testimonial.kira {

  .name { color: $very-dark-blackish-blue; }
  .title { color: rgba($very-dark-blackish-blue, 50%); }
  .quote-part-2 { color: rgba($very-dark-blackish-blue, 70%); }
}

.attribution {
  $a: $moderate-violet;

  background-color: rgba($very-dark-grayish-blue, 10%);
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1.7rem 0;
  padding: 0.3rem 0.5rem;
  border-radius: 0.3rem;
    
  p:first-of-type::after {
    content: " ";
    white-space: pre-wrap;
  }

  a {
    color: rgba($a, 80%);
    font-weight: 700;
    &:hover {
      color: rgba($a, 60%);
    }
    &:active {
      color: rgba($a, 80%);
    }
  }
}



