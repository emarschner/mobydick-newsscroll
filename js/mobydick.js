var templates = {
  split: $('<div>').addClass('split').append(
      //$('<a>').attr('href', '#').text('Split section')
      $('<a>').attr('href', '#').html('<img src="images/link_delete.png"/> Split section...')
    ),
  combine: $('<div>').addClass('combine').append(
      //$('<a>').attr('href', '#').text('Combine sections')
      $('<a>').attr('href', '#').html('Combine sections... <img src="images/link_add.png"/>')
    ),
  controls: $('<div>').addClass('controls').append(
      //$('<a>').addClass('flag').attr('href', '#').text('Flag/Remove section')
      $('<a>').addClass('flag').attr('href', '#').html('<img src="images/flag_red.png"/>')
    ).append(
      //$('<a>').addClass('mark-unimportant').attr('href', '#').text('Mark section as unimportant')
      $('<a>').addClass('mark-unimportant').attr('href', '#').html('<img src="images/delete.png"/>')
    ).append(
      //$('<a>').addClass('mark-important').attr('href', '#').text('Mark section as important')
      $('<a>').addClass('mark-important').attr('href', '#').html('<img src="images/add.png"/>')
    ).append(
      //$('<a>').addClass('unmark-importance').attr('href', '#').text('Unmark section importance')
      $('<a>').addClass('unmark-importance').attr('href', '#').html('<img src="images/cross_gray.png"/>')
    ).append(
      $('<a>').addClass('show').attr('href', '#').text('Show more')
    ).append(
      $('<a>').addClass('hide').attr('href', '#').text('Hide section')
    ),
  snippet: $('<p>').addClass('snippet'),
  expand: $('<p>').addClass('expand').append(
      $('<a>').addClass('expand-article').attr('href', '#').text('Expand article...'),
      $('<a>').addClass('compress-article').attr('href', '#').text('Compress article...')
    ),
  beforeCount: $('<div>').addClass('before-count').append(
      $('<span>').addClass('arrow').html('&uarr; ')
    ).append(
      $('<span>').addClass('count').html('&nbsp;&nbsp;')
    ).append(' still hidden... ').append(
      $('<a href="#">').addClass('show-full-article').text('show full article')
    ),
  afterCount: $('<div>').addClass('after-count').append(
      $('<span>').addClass('arrow').html('&darr; ')
    ).append(
      $('<span>').addClass('count').html('&nbsp;&nbsp;')
    ).append(' still hidden... ').append(
      $('<a href="#">').addClass('show-full-article').text('show full article')
    ),
  articleTick: $('<div>').addClass('article-tick').addClass('tick'),
  importantTick: $('<div>').addClass('important-tick').addClass('tick')
}
templates.section = $('<div>').addClass('section').append(
    templates.controls.clone()
  )

var controlsHandler = function(event) {
  if ($('.show:visible', this).size() > 0) {
    $('.show', this).click();
  } else if ($('.hide:visible', this).size() > 0) {
    $('.hide', this).click();
  }
}

var adminOnHandler = function(event) {
  $('#moby-dick-content').addClass('admin');
  $('.admin-on').hide();
  $('.admin-off').show();
  $('.add-btn').show();

  event.stopPropagation();
  return false;
}

var adminOffHandler = function(event) {
  $('#moby-dick-content').removeClass('admin');
  $('.admin-off').hide();
  $('.add-btn').hide();
  $('.add-popup').hide();
  $('.admin-on').show();

  event.stopPropagation();
  return false;
}

var showHandler = function(event) {
  section = $(this).parents('.section');
  $('> :not(.split)', section).slideDown('fast');
  section.addClass('visible');

  event.stopPropagation();
  return false;
}

var hideHandler = function(event) {
  section = $(this).parents('.section');
  $('> :visible:not(.controls):not(.split)', section).slideUp('fast');
  section.removeClass('visible');

  event.stopPropagation();
  return false;
}

var markImportantHandler = function(event) {
  section = $(this).parents('.section');
  section.removeClass('unimportant');
  section.addClass('important');
  section.children(':not(:visible):not(.split)').slideDown('fast');
  section.removeClass('visible');

  event.stopPropagation();
  return false;
}

var markUnimportantHandler = function(event) {
  section = $(this).parents('.section');
  section.removeClass('important');
  section.addClass('unimportant');
  section.children(':visible:not(.controls):not(.split)').slideUp('fast');
  section.removeClass('visible');

  event.stopPropagation();
  return false;
}

var unmarkImportanceHandler = function(event) {
  section = $(this).parents('.section');
  section.removeClass('important');
  section.removeClass('unimportant');
  section.children(':visible:not(.controls):not(.split)').slideUp('fast');
  section.removeClass('visible');

  event.stopPropagation();
  return false;
}

var flagHandler = function(event) {
  section = $(this).parents('.section');
  $.merge(section.prev('.combine'), section.next('.combine')).first().remove();
  section.remove();

  event.stopPropagation();
  return false;
}

var splitHandler = function(event) {
  var section = $(this).parents('.section');
  var elemsAfter = $(this).parent().nextAll();
  $(this).remove();

  var newSection = templates.section.clone()
  newSection.insertAfter(section).append(elemsAfter);
  $('.controls', newSection).prepend(
    templates.snippet.clone().text($('p:first', newSection).text().split(' ', 5).join(' ') + '...')
  );
  templates.combine.clone().insertAfter(section);

  event.stopPropagation();
  return false;
}

var combineHandler = function(event) {
  var topSection = $(this).parent().prev('.section');
  var bottomSection = $(this).parent().next('.section');
  $(this).parent().remove();

  bottomSection.children('.controls').remove();
  templates.split.clone().appendTo(topSection);
  bottomSection.children().appendTo(topSection);
  bottomSection.remove();

  event.stopPropagation();
  return false;
}

var showAddHandler = function(event) {
  $('.add-popup').show();

  event.stopPropagation();
  return false;
}

var addHandler = function(event) {
  var article = $('#article-select').val();
  var id = "#" + article;
  $(id).show();
  $(id).removeClass('hidden');
  $('.add-article').attr("href", id);
  $('#article-select option[value="' + article + '"]').remove();
  $('.add-popup').hide();

  initSlider();
}

var expandHandler = function(event) {
  var sections = $(this).parents('.article').children('.section');
  $('> :not(.split)', sections).slideDown('fast');
  sections.addClass('visible');

  $(this).hide();
  console.log($(this).siblings);
  $(this).siblings('.compress-article').show();

  event.stopPropagation();
  return false;
}

var showFullArticleHandler = function(event) {
  var article = $(this).parents('.article');
  var articleSections = $('.section', article);
  var allSections = $('.article:not(.hidden) .section');
  var sliderValues = $('#slider').slider('option', 'values');

  var startIndex = allSections.size() - sliderValues[1];
  var endIndex = allSections.size() - sliderValues[0];
  var sectionIndex = -1;

  sectionIndex = allSections.index(articleSections.first());
  if (sectionIndex < startIndex)
    sliderValues[1] = allSections.size() - sectionIndex;
  sectionIndex = allSections.index(articleSections.last());
  if (sectionIndex > endIndex)
    sliderValues[0] = allSections.size() - endIndex - 2;

  $('#slider').slider('option', 'values', sliderValues);
  slideHandler(sliderValues);

  $('html, body').animate({
    scrollTop: article.offset().top - 60
  }, 250);

  event.stopPropagation();
  return false;
}

var isArticleEmpty = function(section) {
  return $(section).parent().children('.section:visible').size() == 0;
}

var compressHandler = function(event) {
  var sections = $(this).parents('.article').children('.section:not(.important)');
  $('> :visible:not(.controls):not(.split)', sections).slideUp('fast');
  sections.removeClass('visible');

  $(this).hide();
  $(this).siblings('.expand-article').show();

  event.stopPropagation();
  return false;
}

var isArticlePartiallyHidden = function(section) {
  return $(section).parent().children('.section:not(:visible)').size() != 0;
}

var slideHandler = function(values) {
  var sections = $('.article:not(.hidden) .section');
  var startIndex = sections.size() - values[1];
  var endIndex = sections.size() - values[0];

  for (var i = 0; i < startIndex; i++) {
    $(sections[i]).hide();
    if (isArticleEmpty(sections[i]))
      $(sections[i]).parent().hide();
  }
  for (var i = startIndex; i < endIndex; i++) {
    $(sections[i]).parent().show();
    $(sections[i]).show();
  }
  for (var i = endIndex; i < sections.size(); i++) {
    $(sections[i]).hide();
    if (isArticleEmpty(sections[i]))
      $(sections[i]).parent().hide();
  }

  $('.article .before-count, .article .after-count').hide();
  if (isArticlePartiallyHidden(sections[startIndex])) {
    var article = $(sections[startIndex]).parent();
    var beforeCount = $('.before-count', article);
    var allSections = $('.section', article);
    var visibleSections = $('.section:visible', article);
    var count = allSections.index(visibleSections.first());
    if (count > 0) {
      $('.count', beforeCount).text(count);
      beforeCount.show();
    }
  }
  if (isArticlePartiallyHidden(sections[endIndex - 1])) {
    var article = $(sections[endIndex]).parent();
    var afterCount = $('.after-count', article);
    var allSections = $('.section', article);
    var visibleSections = $('.section:visible', article);
    count = allSections.size() - allSections.index(visibleSections.last()) - 1;
    if (count > 0) {
      $('.count', afterCount).text(count);
      afterCount.show();
    }
  }

  var allArticles = $('.article:not(.hidden)'); 
  $('#moby-dick-content > .total-count .count').text(allArticles.size());

  var visibleArticles = $('.article:visible');
  var numBefore = allArticles.index(visibleArticles.first());
  var numAfter = allArticles.size() - allArticles.index(visibleArticles.last()) - 1;

  var beforeCount = $('#moby-dick-content > .before-count');
  if (numBefore > 0) {
    $('.count', beforeCount).text(numBefore);
    beforeCount.show();
  } else {
    beforeCount.hide();
  }

  var afterCount = $('#moby-dick-content > .after-count');
  if (numAfter > 0) {
    $('.count', afterCount).text(numAfter);
    afterCount.show();
  } else {
    afterCount.hide();
  }
}

var startHandleHandler = function(event) {
  var sections = $('.article:not(.hidden) .section');
  var startIndex = sections.size() - $('#slider').slider('option', 'values')[1];
  $('html, body').animate({
    scrollTop: $(sections[startIndex]).parent().offset().top - 60
  }, 250);
}

var endHandleHandler = function(event) {
  var sections = $('.article:not(.hidden) .section');
  var endIndex = sections.size() - $('#slider').slider('option', 'values')[0];
  $('html, body').animate({
    scrollTop: $(sections[endIndex - 1]).parent().offset().top - 60
  }, 250);
}

var initSlider = function() {
  var maxValue = $('.article:not(.hidden) .section').size();
  var initialValues = [maxValue - 33, maxValue - 21];
  $("#slider").slider({
    orientation: "vertical",
    range: true,
    max: maxValue,
    values: initialValues,
    slide: function(event, ui) {
      slideHandler(ui.values);
    }
  });
  slideHandler(initialValues);
  var handles = $('#slider .ui-slider-handle');
  handles.last().bind('click', startHandleHandler);
  handles.first().bind('click', endHandleHandler);

  $('#slider .tick').remove();
  var allSections = $('.article:not(.hidden) .section');
  $('.article:not(.hidden)').each(function(index, element) {
    var pos = 100 *
              $(element).prevAll('.article').children('.section').size() /
              allSections.size();
    var tick = templates.articleTick.clone().append(
      $('<span>').addClass('text').html(
        $('.header .date', element).text().replace(/ /g, '&nbsp') +
        '<br/>Headline:&nbsp;' +
        $('.header .title', element).text().replace(/ /g, '&nbsp')
      )
    );
    tick.css('top', pos + '%');
    $('#slider').append(tick);
  });
  $('.article:not(.hidden) .section.important').each(function(index, element) {
    var pos = 100 *
              (
                $(element).parent().prevAll('.article').children('.section').size() +
                $(element).prevAll('.section').size()
              ) /
              allSections.size();
    var tick = templates.importantTick.clone().append(
      $('<span>').addClass('text').html(
        $(element).children(':not(.controls)').text().split(' ', 20).join('&nbsp;') + '...'
      )
    );
    tick.css('top', pos + '%');
    $('#slider').append(tick);
  });
}

$(function() {
  // Add user controls to DOM
  $('.section').each(function(index, element) {
    $(element).prepend(templates.controls.clone().prepend(
      templates.snippet.clone().text($('p:first', element).text().split(' ', 5).join(' ') + '...')
    ));
    $(element).children(':not(.controls):not(:last-child)').each(function(index, element) {
      templates.split.clone().insertAfter($(element));
    });
  });
  $('.section').filter(':not(:last-child)').each(function(index, element) {
    templates.combine.clone().insertAfter($(element));
  });
  $('.header').append(templates.expand.clone());

  $('.article .header').each(function(index, element) {
    templates.beforeCount.clone().insertAfter(element);
  });
  $('.article').each(function(index, element) {
    $(element).append(templates.afterCount.clone());
  });

  $('.compress-article').hide();

  $('.split a').live('click', splitHandler);
  $('.combine a').live('click', combineHandler);
  $('.split').live('click', function(event) { $('a', this).click(); });
  $('.combine').live('click', function(event) { $('a', this).click(); });
  $('.mark-important').live('click', markImportantHandler);
  $('.mark-unimportant').live('click', markUnimportantHandler);
  $('.unmark-importance').live('click', unmarkImportanceHandler);
  $('.flag').live('click', flagHandler);
  $('.show').live('click', showHandler);
  $('.hide').live('click', hideHandler);
  $('.controls').live('click', controlsHandler);
  $('.expand-article').live('click', expandHandler);
  $('.compress-article').live('click', compressHandler);

  $('.article .before-count a, .article .after-count a').live('click', showFullArticleHandler);
  $('.article .before-count, .article .after-count').live('click', function(event) { $('a', this).click(); });

  $('.admin-on').bind('click', adminOnHandler);
  $('.admin-off').bind('click', adminOffHandler);
  $('.add-btn').bind('click', showAddHandler);
  $('.add-article').bind('click', addHandler);

  initSlider();
});
