@@ .. @@
   useEffect(() => {
     // Initialize BGM
     if (!bgmRef.current) {
-      bgmRef.current = new Audio('https://p.gsxcdn.com/3076374150_wju8pkal.mp3');
+      // 移除外部音频文件引用，使用程序生成的音效
+      bgmRef.current = null;
       bgmRef.current.loop = true;
       bgmRef.current.volume = 0.3;
     }

     if (isPlaying) {
-      // Start BGM
-      bgmRef.current?.play().catch(console.warn);
+      // 不再播放外部BGM，专注于节拍音效
       
       const beatInterval = (60 / bpm) * 1000;
       
       intervalRef.current = setInterval(() => {
         onBeat();
         playBeatSound();
       }, beatInterval);
     } else {
-      // Pause BGM
-      if (bgmRef.current) {
-        bgmRef.current.pause();
-      }
+      // 清理定时器
       
       if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
       }
     }

     return () => {
       if (intervalRef.current) {
         clearInterval(intervalRef.current);
       }
     };
   }, [bpm, isPlaying, onBeat]);

-  // Cleanup BGM on unmount
-  useEffect(() => {
-    return () => {
-      if (bgmRef.current) {
-        bgmRef.current.pause();
-        bgmRef.current = null;
-      }
-    };
-  }, []);