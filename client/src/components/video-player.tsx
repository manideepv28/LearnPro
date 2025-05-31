import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onVideoEnd: () => void;
  isCompleted: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoPlayer({ videoId, title, onVideoEnd, isCompleted }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(isCompleted);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (player && isReady) {
      player.loadVideoById(videoId);
      setHasEnded(isCompleted);
    }
  }, [videoId, player, isReady, isCompleted]);

  const initializePlayer = () => {
    if (playerRef.current && window.YT && window.YT.Player) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setPlayer(event.target);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setHasEnded(true);
              onVideoEnd();
            }
          },
        },
      });
    }
  };

  const markAsComplete = () => {
    setHasEnded(true);
    onVideoEnd();
  };

  return (
    <div className="w-full">
      <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ paddingBottom: '56.25%' }}>
        <div ref={playerRef} className="absolute inset-0" />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <Play className="h-12 w-12 mx-auto mb-2" />
              <p>Loading video...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          {hasEnded ? (
            <div className="flex items-center text-green-400">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">Completed</span>
            </div>
          ) : (
            <Button 
              onClick={markAsComplete}
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Mark as Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
