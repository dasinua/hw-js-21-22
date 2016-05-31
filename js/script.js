'use strict';
const urlQuestions = "http://dasinua.github.io/hw-js-21-22/questions.json";
const urlTemplates = "http://dasinua.github.io/hw-js-21-22/templates.json";

var questions = {};


class Question {
    constructor (data) {
        this.id = data.id;
        this.title = data.title;
        this.answers = data.answers;
        this.correct = data.correct;
    }
    check (answerID) {
        return ( answerID == this.correct );
    }
}

class Test {
    constructor () {
        this.questionTmpl;
        this.resutlTmpl;
        this.questions = [];
        this.passed = true;
    }
    initQestions (url) {
        let response;
        $.ajax(
            {url: url,
            async: false,
            success: function(data) {
                     response = data;}
            });
//        this.questions = response;
        this.questions = _.map(response, item => new Question (item));

    }
    initTemplate (url) {
        //Как их success функции записать результат сразу в this.questionTmpl?
        let response;
        $.ajax(
            {url: url,
            async: false,
            success: function(data) {
                     response = data;}
            });
        this.questionTmpl = response.questionTmpl;
        this.resultTmpl = response.resultTmpl;
    }
}

var test = new Test();
try {
module.exports = test;
} catch (err) {}


$(function () {
  var testPassed = true;



test.initQestions(urlQuestions);
test.initTemplate(urlTemplates);
    debugger;
questions = test.questions;
  var tmplFn = _.template(test.questionTmpl);
  var tmplResultFn = _.template(test.resultTmpl);


  //  Проходимся по массиву вопросов и заполняем DOM.
//    Нечего рефакторить в ES-2015
  questions.forEach(function (item, i) {
    item.questionIndex = i;
    var html = tmplFn(item);
    $('.questions').append(html);
  });

//    Есть что рефакторить
  $('#submitTest').click(function (e) {
        var testResult = $('#test').serializeArray();
        e.preventDefault();

    //  Проверяем правильность ответов
//      Разбить  item на переменные используя деструктуризацию
    testResult.forEach(function (item, i) {
            var question = eval(item.name);
            questions[question.questionIndex].result = (question.correct == item.value) ? true : false;
    });

    //  Формирум body  модального окна
      //    Нечего рефакторить в ES-2015
    questions.forEach(function (item, index) {
      switch (item.result) {
      case undefined:
        item.result = 'Вопрос не отвечен';
        testPassed = false;
        break;
      case true:
        item.result = 'Правильно';
        break
      case false:
        item.result = 'Неправильно';
        testPassed = false;
        break
      }

      var html = tmplResultFn(item);
      $('#resultModal .modal-body ol').append(html);
    })

    var html = (testPassed) ? '<h3 class="result">Тест пройден!</h3>' : '<h3 class="result">Тест провален!</h3>'
    $('#resultModal .modal-footer').append(html);
    $('body').append('<div class="shadow"></div>');
    $('#resultModal').show();

  });

  //  Закрываем модальное окно
  //    Нечего рефакторить в ES-2015
  $('[data-dismiss="modal"]').click(function () {
    $('.modal').hide();
    location.reload();
    localStorage.clear();
  });



  //Запоминаем варианты ответов в локальное хранилище
 //Можно распарсить аргумент функции
    $('.question input').change(function (e) {
    var value = e.target.value;
    var question = eval(e.target.name);
    var i = question.questionIndex;
    var answersStr = localStorage.getItem('answers');
    var answers = (answersStr) ? JSON.parse(answersStr) : [];

    answers[i] = value;
    console.log(answers);
    answersStr = JSON.stringify(answers);
    localStorage.setItem('answers', answersStr);
  })

//Если тест уже отвечался считываю ответы
//Заюзать строки шаблоны
  function resumeTest() {
    var answersStr = localStorage.getItem('answers');
    if (answersStr == null)
      return;
    var answers = JSON.parse(answersStr);
    answers.forEach(function (item, i) {
      if (!item) return;
      var $question = $('[name="questions[' + i + ']"][Value="' + item + '"]');
      $question.trigger('click');
    })
  };
  resumeTest();

  //Запрет обнвление страницы при отправки формы
  $('#test').submit(function (e) {
    e.preventDefault();
  });
})

