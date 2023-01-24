import { useRef, useEffect, useState } from "react";
import "./App.css";

const EXTRA_THRESHOLD_PERCENTAGE = 25;

function App() {
  const [isAnswered, setAnswered] = useState(false);
  const [isReminderVisible, setReminderVisible] = useState(false);
  const [topPositionWhenAnswered, setTopPositionWhenAnswered] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rejoinderRef = useRef<HTMLDivElement>(null);
  const [hasScrolledUpPastThreshold, setScrolledUpPastThreshold] =
    useState(false);

  const firstIntersectionEntry = useRef<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (isAnswered) {
      const scrollRect = scrollContainerRef.current!.getBoundingClientRect();
      const rejoinderRect = rejoinderRef.current!.getBoundingClientRect();
      const isRejoinderAlreadyOffScreen =
        rejoinderRect.top <
        scrollRect.height * (EXTRA_THRESHOLD_PERCENTAGE / 100);

      if (isRejoinderAlreadyOffScreen && !hasScrolledUpPastThreshold) {
        setTimeout(() => {
          const handler = () => {
            requestAnimationFrame(() => {
              if (
                scrollContainerRef.current!.scrollTop > topPositionWhenAnswered
              ) {
                setReminderVisible(true);
              }

              const scrollRect =
                scrollContainerRef.current!.getBoundingClientRect();
              const rejoinderRect =
                rejoinderRef.current!.getBoundingClientRect();
              if (
                !(
                  rejoinderRect.top <
                  scrollRect.height * (EXTRA_THRESHOLD_PERCENTAGE / 100)
                )
              ) {
                setScrolledUpPastThreshold(true);
              }
            });
          };
          scrollContainerRef.current!.addEventListener("scroll", handler);
          return () =>
            scrollContainerRef.current?.removeEventListener("scroll", handler);
        });
      } else {
        const observer = new IntersectionObserver(
          (entries, _observer) => {
            const entry = entries[0];
            if (!entry.isIntersecting) {
              setReminderVisible(true);
            }
          },
          {
            root: scrollContainerRef.current,
            rootMargin: `-${EXTRA_THRESHOLD_PERCENTAGE}% 0% 0%`,
            threshold: 1.0,
          }
        );
        observer.observe(rejoinderRef.current!);
        return () => observer.disconnect();
      }
    }
  }, [isAnswered, hasScrolledUpPastThreshold]);

  const handleSaveAnswer = () => {
    setAnswered(true);
    setTopPositionWhenAnswered(scrollContainerRef.current!.scrollTop);
  };

  const handleReset = () => {
    scrollContainerRef.current!.scrollTop = 0;
    setAnswered(false);
    setReminderVisible(false);
    setTopPositionWhenAnswered(0);
    firstIntersectionEntry.current = null;
    setScrolledUpPastThreshold(false);
  };

  return (
    <>
      <div id="scrolling" ref={scrollContainerRef}>
        <div id="inner">
          <p>
            Put a bird on it retro kitsch, copper mug chambray labore keffiyeh
            kickstarter woke quinoa. Gorpcore cardigan fanny pack tumeric small
            batch snackwave adipisicing. PBR&B la croix sriracha pinterest marfa
            yr irony. Photo booth selfies organic cillum health goth hashtag
            chicharrones semiotics. Deserunt four loko sed adipisicing,
            letterpress heirloom ut marxism scenester JOMO. Eu mumblecore
            cillum, copper mug squid bitters shabby chic tilde ex XOXO praxis
            truffaut. You probably haven't heard of them cray echo park, in
            Brooklyn green juice fashion axe blog ugh post-ironic lyft.
          </p>
          <p>
            Flexitarian poke shoreditch umami, you probably haven't heard of
            them ascot crucifix single-origin coffee meditation irure glossier
            irony vegan praxis keffiyeh. Seitan tacos fingerstache microdosing
            8-bit letterpress selvage gluten-free umami in chillwave ea taiyaki
            adaptogen artisan. Letterpress iPhone fam, banjo fugiat portland
            cray dolor man braid tonx. Anim marxism sustainable, palo santo
            biodiesel est do meditation chillwave gorpcore jawn wayfarers
            humblebrag fanny pack coloring book.
          </p>
          <p>
            Put a bird on it retro kitsch, copper mug chambray labore keffiyeh
            kickstarter woke quinoa. Gorpcore cardigan fanny pack tumeric small
            batch snackwave adipisicing. PBR&B la croix sriracha pinterest marfa
            yr irony. Photo booth selfies organic cillum health goth hashtag
            chicharrones semiotics. Deserunt four loko sed adipisicing,
            letterpress heirloom ut marxism scenester JOMO. Eu mumblecore
            cillum, copper mug squid bitters shabby chic tilde ex XOXO praxis
            truffaut. You probably haven't heard of them cray echo park, in
            Brooklyn green juice fashion axe blog ugh post-ironic lyft.
          </p>

          {isAnswered ? (
            <div id="rejoinder" ref={rejoinderRef}>
              <span className="incorrect">Incorrect.</span>&nbsp;A candidate’s
              military service would be more important in retrospective voting,
              not prospective voting.
            </div>
          ) : (
            <button id="show-rejoinder" onClick={handleSaveAnswer}>
              Save Answer
            </button>
          )}

          <p>
            Iceland literally mlkshk paleo lorem excepteur sriracha live-edge.
            Gastropub crucifix umami, fugiat seitan stumptown poutine
            single-origin coffee adipisicing. Ullamco irony disrupt readymade
            tonx chia consectetur occupy solarpunk gorpcore adaptogen palo santo
            selfies elit gentrify. Microdosing DIY health goth vape.
          </p>

          <p>
            Shaman heirloom normcore, vice af flannel craft beer humblebrag in
            umami bruh tumblr ullamco ut chicharrones. +1 ipsum church-key
            mumblecore af mlkshk cillum. Enamel pin locavore cred banjo
            semiotics. Shoreditch letterpress glossier tempor narwhal, nostrud
            do cornhole tumeric marfa esse pabst. Pug organic cred voluptate
            green juice consequat. Shoreditch 8-bit shaman sunt actually tumeric
            disrupt. IPhone PBR&B disrupt est kogi ut.
          </p>

          <p>
            Flexitarian poke shoreditch umami, you probably haven't heard of
            them ascot crucifix single-origin coffee meditation irure glossier
            irony vegan praxis keffiyeh. Seitan tacos fingerstache microdosing
            8-bit letterpress selvage gluten-free umami in chillwave ea taiyaki
            adaptogen artisan. Letterpress iPhone fam, banjo fugiat portland
            cray dolor man braid tonx. Anim marxism sustainable, palo santo
            biodiesel est do meditation chillwave gorpcore jawn wayfarers
            humblebrag fanny pack coloring book.
          </p>
        </div>
        <div id="overlay" hidden={!isReminderVisible} />
      </div>
      <button onClick={handleReset}>Reset</button>
    </>
  );
}

export default App;
