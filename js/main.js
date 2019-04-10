let question_list = {};

$(function() {
  const config = {
    apiKey: "AIzaSyBJ9spM0Gq02Jrq55TutDHVSDXKVW_mlfc",
    authDomain: "asamadesoreseikai.firebaseapp.com",
    databaseURL: "https://asamadesoreseikai.firebaseio.com",
    storageBucket: "asamadesoreseikai.appspot.com",
  };
  firebase.initializeApp(config);

  const db = firebase.database();

  const dbQuestionList = db.ref('/question_list');
  dbQuestionList.on("value", function(snapshot) {
    question_list = snapshot.val();
    console.log(question_list);
  });

  $('#add_odai').on('click', function() {
    const memotext = $('#memo_text').val();

    if(memotext == "" && memotext != null) {
      window.alert("お題を入力してください");
      return;
    }

    const result = window.confirm("「〇」で始まる\n" + memotext + "\n\nを投稿します");
    if(result) {
      const dbQuestionList = db.ref('/question_list');
      dbQuestionList.push(memotext);
      $('#memo_text').val("");
    }
  });

  $('#next_odai').on('click', function() {
    const kanaText = getRandamKana();
    const keyList = Object.keys(question_list);
    const odaiNum = Math.floor(Math.random() * keyList.length);
    const odaiText = question_list[keyList[odaiNum]];

    $('#initial_text').text("「" + kanaText + "」で始まる");
    $('#main_text').text(odaiText);
  });

  $('#change_initial').on('click', function() {
    const kanaText = getRandamKana();

    $('#initial_text').text("「" + kanaText + "」で始まる");
  });

  $('.title').on('click', function(e) {
    const initialText = $('#initial_text').text();
    const mainText = $('#main_text').text();
    const odaitext = initialText + " " + mainText;

    const dbQuestion = db.ref('/question');
    dbQuestion.set(odaitext);

    const dbResultDisp = db.ref('/result_disp');
    dbResultDisp.set(false);

    for(let userId = 0; userId < 8; userId++) {
      const dbAnswer = db.ref('/user_list/user' + userId + '/answer');
      dbAnswer.set("");

      for(let fromId = 0; fromId < 8; fromId++) {
        const dbGood = db.ref('/user_list/user' + userId + '/judge/good/from' + fromId);
        const dbBad = db.ref('/user_list/user' + userId + '/judge/bad/from' + fromId);

        dbGood.set(false);
        dbBad.set(false);
      }
    }
  });
});

const getRandamKana = function() {
  const str = "あいうえおかきくけこさしすせそたちつてと" +
  "なにぬねのはひふへほまみむめもやゆよらりるれろわ" +
  "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
  const strNum = Math.floor(Math.random() * str.length);
  return str[strNum];
}
