// Voice ප්ලේ කරන Function එක
const speakResponse = (text, voiceType) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  
  // සියලුම වොයිස් ලිස්ට් එක ගන්න
  const voices = synth.getVoices();

  // මෙතනදී ඔයා තෝරන Voice එක අනුව filter කරනවා
  // (වොයිස් වර්ග බ්‍රවුසර් එක අනුව වෙනස් විය හැක)
  if (voiceType === 'girl-1') {
    utterance.voice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female'));
  } else if (voiceType === 'boy-1') {
    utterance.voice = voices.getVoices().find(v => v.name.includes('Google UK English Male') || v.name.includes('Male'));
  }

  utterance.pitch = 1.0;
  utterance.rate = 1.0;
  
  synth.speak(utterance);
};
