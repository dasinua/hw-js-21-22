
var jsdom = require("jsdom").jsdom;
global.window = jsdom().defaultView;
global.jQuery = global.$ = require("jquery");
global._ = require("lodash");

var test = require('../js/script.js');

;


describe("Test my created classes andt their metods", function() {
  it("test get questions", function() {
//      prepare

      var questionTmpl = "",
          resultTmpl = "";

//Получаю с сервера шаблоны, чтобы сровнить их
       $.ajax(
            {url: "http://ivanov-aleksander.github.io/js20-21/templates.json",
            async: false,
            success: function(data) {
                     response = data;
              questionTmpl = data.questionTmpl;
              resultTmpl = data.resultTmpl;
            }
            });

//Обьект второго вопроса
          secondQuestion = {id: 3,
                            title: "К какому участку скрипта применяется строгие правила ‘use strict?",
                            answers: ["Строгие правила работают между директивами ‘use strict’ и ‘strict end’", "Внутри блока {}", "Во всем скрипте.", "Либо во всем скрипте, либо в отдельной функции."],
                            correct: 3
                           };

//      act
      test.initQestions("http://ivanov-aleksander.github.io/js20-21/questions.json");
      var resultQuestion = test.questions[2];


//      assert

    expect(resultQuestion.title).toEqual(secondQuestion.title);
    expect(resultQuestion.correct).toEqual(secondQuestion.correct);
    expect(resultQuestion.answers).toEqual(secondQuestion.answers);

  });

      it("test get templates", function() {
               var questionTmpl = "";

//Получаю с сервера шаблоны, чтобы сровнить их
       $.ajax(
            {url: "http://ivanov-aleksander.github.io/js20-21/templates.json",
            async: false,
            success: function(data) {
                     response = data;
              questionTmpl = data.questionTmpl;
            }
            });

           test.initTemplate("http://ivanov-aleksander.github.io/js20-21/templates.json");
           var resulTmplQuestion = test.questionTmpl;
           expect(resulTmplQuestion).toEqual(questionTmpl);

      });
});
