@@ .. @@
   const executeAction = useCallback((action: 'jump' | 'forward' | 'crouch') => {
     const now = Date.now();
     
     setGameState(prev => {
       const newCharacter = { ...prev.character };
       let newScore = prev.score;
       let newCombo = prev.combo;
-      let actionSuccess = false;
       
       // Check if action is on beat 8 (action beat)
       const isActionBeat = prev.currentBeat === 7; // 0-indexed, so beat 8 is index 7
       
       if (isActionBeat && prev.currentQuestion && prev.selectedAnswer !== null) {
         const isCorrectAnswer = prev.currentQuestion.options[prev.selectedAnswer] === prev.currentQuestion.correctAnswer;
         
         if (isCorrectAnswer) {
           newScore += 10;
           newCombo += 1;
-          actionSuccess = true;
           
           // Execute character action
           switch (action) {
             case 'jump':
               newCharacter.y = Math.max(0, newCharacter.y - 1);
               break;
             case 'forward':
               newCharacter.x = Math.min(GRID_WIDTH - 1, newCharacter.x + 1);
               break;
             case 'crouch':
               newCharacter.y = Math.min(GRID_HEIGHT - 1, newCharacter.y + 1);
               break;
           }
+          
+          return {
+            ...prev,
+            character: newCharacter,
+            score: newScore,
+            combo: newCombo,
+            lastActionTime: now
+          };
         } else {
           // Wrong answer selected - miss
           newCombo = 0;
+          setToastMessage({
+            message: 'MISS! 答案错误',
+            type: 'miss',
+            timestamp: now
+          });
         }
       } else if (isActionBeat) {
         // Action executed on correct beat but no answer selected or wrong timing - miss
         newCombo = 0;
+        setToastMessage({
+          message: 'MISS! 未选择答案',
+          type: 'miss',
+          timestamp: now
+        });
       } else {
         // Action executed on wrong beat - miss
         newCombo = 0;
+        setToastMessage({
+          message: 'MISS! 节拍错误',
+          type: 'miss',
+          timestamp: now
+        });
       }
       
       newCharacter.action = action;
       newCharacter.isMoving = true;
       
       return {
         ...prev,
         character: newCharacter,
         score: newScore,
         combo: newCombo,
-        lastActionTime: now,
-        actionSuccess
+        lastActionTime: now
       };
     });
-    
-    // Show miss toast if action was not successful
-    setGameState(prev => {
-      if (!prev.actionSuccess) {
-        setToastMessage({
-          message: 'MISS! 连击中断',
-          type: 'miss',
-          timestamp: now
-        });
-      }
-      return {
-        ...prev,
-        actionSuccess: undefined // Clear the temporary flag
-      };
-    });
   }, []);