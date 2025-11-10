'use client';

import { useState, useRef, useEffect } from 'react';
import { MediaFile } from '@/store/mediaStore';
import { useEditorStore } from '@/store/editorStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Scissors,
  X,
  Check,
  Undo,
  Download,
} from 'lucide-react';

interface VideoTrimmerProps {
  media: MediaFile;
  onSave: (editedVideoUrl: string) => void;
  onCancel: () => void;
}

export function VideoTrimmer({ media, onSave, onCancel }: VideoTrimmerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { videoTrim, setVideoTrim, reset } = useEditorStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const dur = video.duration;
      setDuration(dur);
      setEndTime(dur);
      setVideoTrim({ start: 0, end: dur });
    };

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);

      // Pause if we reach the end time
      if (endTime > 0 && time >= endTime) {
        video.pause();
        setIsPlaying(false);
        video.currentTime = startTime;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      reset();
    };
  }, [endTime, startTime, reset, setVideoTrim]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      // Start from trim start if not in range
      if (currentTime < startTime || currentTime >= endTime) {
        video.currentTime = startTime;
      }
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleStartDrag = (e: React.MouseEvent) => {
    setIsDraggingStart(true);
    e.preventDefault();
  };

  const handleEndDrag = (e: React.MouseEvent) => {
    setIsDraggingEnd(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!timelineRef.current || (!isDraggingStart && !isDraggingEnd)) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = percent * duration;

    if (isDraggingStart) {
      const newStart = Math.min(time, endTime - 1);
      setStartTime(newStart);
      setVideoTrim({ start: newStart, end: endTime });
      handleSeek(newStart);
    } else if (isDraggingEnd) {
      const newEnd = Math.max(time, startTime + 1);
      setEndTime(newEnd);
      setVideoTrim({ start: startTime, end: newEnd });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  useEffect(() => {
    if (isDraggingStart || isDraggingEnd) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingStart, isDraggingEnd, duration, startTime, endTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setStartTime(0);
    setEndTime(duration);
    setVideoTrim({ start: 0, end: duration });
    handleSeek(0);
  };

  const handleSave = () => {
    // In a real implementation, this would trim the video server-side
    // For now, we'll just return the URL with trim metadata
    console.log('Trimming video from', startTime, 'to', endTime);
    onSave(media.url);
  };

  const trimDuration = endTime - startTime;
  const progressPercent = (currentTime / duration) * 100;
  const startPercent = (startTime / duration) * 100;
  const endPercent = (endTime / duration) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-white font-semibold">Trim Video</h2>
            <p className="text-sm text-gray-400">{media.metadata.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Undo className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Check className="w-5 h-5" />
            Save Trim
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center p-8 bg-black">
        <div className="max-w-6xl w-full">
          <video
            ref={videoRef}
            src={media.url}
            className="w-full max-h-[60vh] bg-black"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Controls */}
          <div className="mt-6 bg-gray-900 rounded-xl p-6">
            {/* Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-white">
                <Scissors className="w-5 h-5 text-purple-500" />
                <span className="text-sm">
                  Trim: {formatTime(trimDuration)} selected
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Timeline */}
            <div
              ref={timelineRef}
              className="relative h-16 bg-gray-800 rounded-lg mb-4 cursor-pointer"
              onClick={(e) => {
                const rect = timelineRef.current?.getBoundingClientRect();
                if (!rect) return;
                const percent = (e.clientX - rect.left) / rect.width;
                handleSeek(percent * duration);
              }}
            >
              {/* Full timeline */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                {/* Selected range */}
                <div
                  className="absolute top-0 bottom-0 bg-purple-500 bg-opacity-30"
                  style={{
                    left: `${startPercent}%`,
                    right: `${100 - endPercent}%`,
                  }}
                />

                {/* Current time indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              {/* Start handle */}
              <div
                className="absolute top-0 bottom-0 w-3 bg-purple-600 cursor-ew-resize hover:bg-purple-500 transition-colors group"
                style={{ left: `${startPercent}%` }}
                onMouseDown={handleStartDrag}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-8 bg-purple-600 rounded-r flex items-center justify-center group-hover:bg-purple-500">
                  <div className="w-0.5 h-4 bg-white rounded" />
                </div>
              </div>

              {/* End handle */}
              <div
                className="absolute top-0 bottom-0 w-3 bg-purple-600 cursor-ew-resize hover:bg-purple-500 transition-colors group"
                style={{ left: `${endPercent}%` }}
                onMouseDown={handleEndDrag}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-8 bg-purple-600 rounded-l flex items-center justify-center group-hover:bg-purple-500">
                  <div className="w-0.5 h-4 bg-white rounded" />
                </div>
              </div>
            </div>

            {/* Time labels */}
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>Start: {formatTime(startTime)}</span>
              <span>End: {formatTime(endTime)}</span>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleSeek(Math.max(0, currentTime - 5))}
                className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => handleSeek(Math.min(duration, currentTime + 5))}
                className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400 text-center">
                💡 Drag the purple handles to select the portion you want to keep
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
