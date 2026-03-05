const createElements = arr => {
  const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
  return htmlElements.join(' ');
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-EN'; // English
  window.speechSynthesis.speak(utterance);
}


const manageSpinner = status => {
  if (status == true) {
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('word-container').classList.add('hidden');
  } else {
    document.getElementById('word-container').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  }
};


// ----------1---------
const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(json => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll('.lesson-btn');
  // console.log(lessonButtons);
  lessonButtons.forEach(btn => btn.classList.remove('active'));
};

// -------2--------
const loadLevelWord = id => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      // console.log(clickBtn);
      clickBtn.classList.add('active');
      displayLevelWord(data.data);
    });
};

// ----------3---------
const loadWordDetail = async id => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  // console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

// {
//     "word": "Linger",
//     "meaning": "থেমে থাকা / বিলম্ব করা",
//     "pronunciation": "লিঙ্গার",
//     "level": 2,
//     "sentence": "She lingered at the door, unwilling to leave.",
//     "points": 2,
//     "partsOfSpeech": "verb",
//     "synonyms": [
//         "stay",
//         "remain",
//         "delay"
//     ],
//     "id": 12
// }

const displayWordDetails = word => {
  console.log(word);
  const detailsBox = document.getElementById('details-container');
  detailsBox.innerHTML = `
    <div>
<h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
   </div>

   <div>
<h2 class="font-bold">Meaning</h2>
<p>${word.Meaning}</p>
   </div>

   <div>
<h2 class="font-bold">Example</h2>
<p>${word.sentence}</p>
   </div>

   <div>
<h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
<div>${createElements(word.synonyms)}</div>
   </div>
  
  `;
  document.getElementById('word_modal').showModal();
};

// -------2-------
const displayLevelWord = words => {
  const wordContainer = document.getElementById('word-container');
  wordContainer.innerHTML = '';

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla"
>
<img class="mx-auto" src="./assets/alert-error.png"/>
 <p class="font-medium text-xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
 <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
</div>
    `;
    manageSpinner(false);
    return;
  }
  // {
  //     "id": 167,
  //     "level": 6,
  //     "word": "Sycophant",
  //     "meaning": "চাটুকার",
  //     "pronunciation": "সাইকোফ্যান্ট"
  // }

  words.forEach(word => {
    // console.log(word);

    const card = document.createElement('div');
    card.innerHTML = `
     <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
  <h2 class="text-2xl font-semibold">${word.word ? word.word : 'শব্দ পাওয়া যায়নি'}</h2>
  <p class="font-semibold">Meaning /Pronounciation</p>
  <div class=" font-bangla text-xl font-semibold">"${word.meaning ? word.meaning : 'অর্থ পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation : 'Pronounciation পাওয়া  যায়নি'}"</div>

  <div class="flex justify-between text-center">
   <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10]"><i class="fa-solid fa-circle-info"></i></button>

   <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10]"><i class="fa-solid fa-volume-high"></i></button>
  </div>
 </div>
    
    `;
    wordContainer.append(card);
  });
  manageSpinner(false);
};

// -----------1----------
const displayLesson = lessons => {
  //  1.get the container
  const levelContainer = document.getElementById('level-container');
  levelContainer.innerHTML = '';
  //  2.get into every lesson
  lessons.forEach(lesson => {
    // console.log(lesson);
    //  3.create HTML Element
    const btnDiv = document.createElement('div');
    btnDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
    `;
    //  4.append chaild
    levelContainer.append(btnDiv);
  });
};

loadLessons();

document.getElementById('btn-search').addEventListener('click', () => {
  removeActive()
  const input = document.getElementById('input-search');
  const searchValue = input.value;
  console.log(searchValue);

  fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    })
})