"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight, MessageCircle, Droplets, HandCoins } from "lucide-react";

export function Tutorial({setShowTutorial}: {setShowTutorial: (show: boolean) => void}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [index, setIndex] = React.useState(0);

  const totalSlides = 5;

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Carousel container */}
        <div className="flex">
            {/* slides;*/}
            <div className="flex-[0_0_100%] flex items-center justify-center text-4xl h-100 p-2">
                <div className="flex flex-col gap-4 items-center justify-center w-full h-full bg-white rounded-lg shadow-md">
                  {/* skip button */}
                {/* <Button onClick={() => emblaApi?.scrollTo(totalSlides - 1)} variant="ghost" className="absolute top-5 right-5"><span className="text-gray-500">Skip Tutorial</span></Button> */}
                    <img
                    src="hydralogo.png"
                    alt="Team Logo"
                    className="w-full h-auto max-w-[2rem] transition-all object-contain"
                    />
                    <div className="flex flex-col gap-2 justify-center items-center">
                    <span className="text-2xl font-semibold">Welcome to the Hydra!</span>
                    <span className="text-sm text-gray-500 text-center">Your eco-friendly AI companion. <br />Chat, collect fish, and protect water.</span>
                    </div>
                </div>
            </div>

            <div className="flex-[0_0_100%] flex items-center justify-center text-4xl h-100 p-2">
                <div className="gap-4 flex flex-col items-center justify-center w-full h-full bg-white rounded-lg shadow-md">
                    <span className="text-2xl font-semibold">How It Works</span>
                    <span className="text-sm text-gray-500">Every AI chat uses real water.</span>
                    <div className="flex items-center justify-center gap-2 border-2 p-4 rounded-md">
                      <MessageCircle/>
                      <ArrowRight className="text-gray-300"/>
                      <Droplets/>
                      <ArrowRight className="text-gray-300"/>
                      <HandCoins/>
                    </div>
                    <span className="text-sm text-gray-500">Hydra turns your prompts into clean water donations.</span>
                </div>
            </div>

            <div className="flex-[0_0_100%] flex items-center justify-center text-4xl h-100 p-2">
                <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-lg shadow-md p-5">
                  <span className="text-2xl font-semibold">Your Water Tank</span>
                  <span className="text-sm text-gray-500 text-center">Each model uses water at a different rate. <br/>Powerful models sip more, lighter ones sip less!<br/><br/> When your tank runs low, just refill it by watching ads or donating.</span>
                </div>
            </div>

            <div className="flex-[0_0_100%] flex items-center justify-center text-4xl h-100 p-2">
                <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-lg shadow-md p-5">
                  <span className="text-2xl font-semibold">Collect Fish</span>
                  <span className="text-sm text-gray-500 text-center">Earn coins by watching ads all the way through. <br/> <br/> Use coins to fish for cute aquatic buddies and buy decorations for your tank.</span>
                </div>
            </div>

            <div className="flex-[0_0_100%] flex items-center justify-center text-4xl h-100 p-2">
                <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-white rounded-lg shadow-md p-5">
                  <span className="text-2xl font-semibold">Let's get started!</span>
                  <div className="flex gap-2">
                  <Button onClick={() => setShowTutorial(false)}>Yes</Button>
                  <Button onClick={() => setShowTutorial(false)}>Yes!</Button>
                  </div>
                </div>
            </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-2 mt-4">

        <Button variant="outline" size="icon" onClick={() => emblaApi?.scrollPrev()} disabled={!emblaApi || index === 0} 
          className={`${ index === 0 ? 'invisible pointer-events-none' : 'visible'}`}>
          <ArrowLeft/>
        </Button>

        <Button variant="outline" size="icon" onClick={() => emblaApi?.scrollNext()} disabled={!emblaApi || index === totalSlides - 1} 
          className={`${ index === totalSlides - 1 ? 'invisible pointer-events-none' : 'visible'}`}>
            <ArrowRight/>
        </Button>
      </div>

    </div>
  );
}
