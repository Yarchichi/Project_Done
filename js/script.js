
function checkMediaQuery() {
  if (window.matchMedia('(max-width: 600px)').matches) {
      $('.exs-title-dropvideo--js').text('New video');
      $('.exs-title-dropimg--js').text('Upload the image preview');
      $('.exs-btn-drop--js').text('Choose files');

  } else {
      $('.exs-title-dropvideo--js').text('Drag and drop videos to upload');
      $('.exs-title-dropimg--js').text('Drag and drop videos to upload');
      $('.exs-btn-drop--js').text('Or choose files');
  }
}
checkMediaQuery();
$(window).resize(checkMediaQuery);

$(function() {
  const $sidebarContent = $('.sidebar').contents();
  const $header = $('.header-menu');

  $(window).on('resize', function() {
      if ($(window).width() <= 992) {
          if (!$sidebarContent.parent().is($header)) {
              $header.append($sidebarContent);
              $('.side-menu-name-link').on('click', (e)=>{
                e.preventDefault();
                $('.sidebar-content .side-menu.user-subscription > li').toggleClass('active')
              })
          }
      } else {
          if (!$sidebarContent.parent().is('.sidebar')) {
              $('.sidebar').append($sidebarContent);
          }
      }
  }).trigger('resize');
});


$(document).ready(function () {

  $('.show-password').on('click', function(e){
    e.preventDefault();
    const $input = $(this).closest('.input-wrap').find('input');
    $input.prop('type', $input.attr('type') === 'password' ? 'text' : 'password');
  });

  $('.default-video-wrap video').each(function() {
    const player = new Plyr(this, {
      title: 'Назва',
    });
    player.on('mouseenter', ()=> {
      player.elements.controls.classList.add('visible-tools')
    });
    player.on('mouseleave', ()=> {
      player.elements.controls.classList.remove('visible-tools')
    });
    player.on('timeupdate', (e) => {
      const currentTime = e.detail.plyr.currentTime;
      const formattedTime = formatTime(currentTime);
      $('.current-time').text(formattedTime);
    })
  });
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  }


  function handleFileInputChange(inputId, avatarClass, infoClass, nameClass, changeClass, deleteWrapClass) {

    const initialState = {
      avatarSrc: $(avatarClass).attr('src'),
      infoClass: $(infoClass).attr('class'),
      nameText: $(nameClass).text(),
      changeHtml: $(changeClass).html(),
      deleteWrapHtml: $(`${infoClass} ${deleteWrapClass}`).html()
    };
  
    $(inputId).on('change', function (e) {
      if (this.files && this.files[0]) {
        let reader = new FileReader();
        let fileName = this.files[0].name;
  
        reader.onload = function (e) {
          $(avatarClass).attr('src', e.target.result).css({"width": "100%", "height": "100%", "object-fit": "cover"});
          $(infoClass).addClass('info-add-photo-result');
          $(nameClass).text(fileName);
          $(changeClass).html('<span class="change-file-btn">Change file</span>');
          $(`.info-add-photo-result ${deleteWrapClass}`).html(`<a href="#" class="delete-photo"><img src="../../img/Trash.svg" alt="delete"></a>`);
        };
  
        reader.readAsDataURL(this.files[0]);
  
        $(document).on('click', `${changeClass} .change-file-btn`, function() {
          $(inputId).click();
        });

        $(infoClass).on('click', `${deleteWrapClass} .delete-photo`, function(e) {
          e.preventDefault();

          $(avatarClass).attr('src', initialState.avatarSrc).css({"width": "auto", "height": "auto"});
          $(infoClass).attr('class', initialState.infoClass);
          $(nameClass).text(initialState.nameText);
          $(changeClass).html(initialState.changeHtml);
          $(`${infoClass} ${deleteWrapClass}`).html(initialState.deleteWrapHtml);
        });
      }
    });
  }
  handleFileInputChange('#file-img', '.avatar', '.info-avatar', '.name-avatar', '.change-avatar', '.delete-photo-wrap');
  handleFileInputChange('#file-img-store', '.avatar-store', '.info-avatar-store', '.name-store', '.change-store', '.delete-photo-wrap');
  handleFileInputChange('#file-img-profile', '.avatar-profile', '.info-avatar-profile', '.name-profile', '.change-profile', '.delete-photo-wrap');
  handleFileInputChange('#file-img-cover', '.avatar-cover', '.info-avatar-cover', '.name-cover', '.change-cover', '.delete-photo-wrap');


  $('.popup-close').click(function() {
		$(this).parents('.popup-fade').fadeOut();
		return false;
	});        
 
	$(document).keydown(function(e) {
		if (e.keyCode === 27) {
			e.stopPropagation();
			$('.popup-fade').fadeOut();
		}
	});
	
	$('.popup-fade').click(function(e) {
		if ($(e.target).closest('.popup').length == 0) {
			$(this).fadeOut();					
		}
	});


  $('textarea').on('input', function (e) {
    autoExpand(e.target);
  });

  function autoExpand(textarea) {
      const $textareaWrap = $(textarea).closest('.textarea-wrap');

      textarea.style.height = '1px';
      textarea.style.height = textarea.scrollHeight + 'px';

      if ($textareaWrap.length) {
          $textareaWrap.css('height', textarea.scrollHeight + 'px');
      }
  }

  const dropAreaVideo = $('.drag-and-drop-video-wrap');
  const dropAreaImg = $('.drag-and-drop-img-wrap');

  function handleFiles(file, dropArea, fileType) {
    const rgxpFileType = new RegExp('^' + fileType + '/');
    if (file.type.match(rgxpFileType)) {
      const reader = new FileReader();
      reader.onload = function(e) {
        if(fileType == 'video'){
          setTimeout(function () {
            $('.uploading-overlay').show();
            dropArea.find('.dropped-file-video-wrap').css({"z-index": "100"});
            dropArea.find('.dropped-file-video-wrap .dropped-file').attr('src', e.target.result);
            dropArea.find('.plyr--video').addClass('active');
            dropArea.find('.file-name').text(file.name);
          }, 500);
          setTimeout(function () {
            $('.uploading-overlay').hide();
          }, 2000);
        }
        
        dropArea.find('.dropped-file').attr('src', e.target.result).css({"z-index": "100"});
      };
      reader.readAsDataURL(file);
    }
  }
  function setupDropArea(dropArea, fileType) {
    dropArea.on('dragover', function(event) {
      event.preventDefault();
      dropArea.addClass('dragover');
    });

    dropArea.on('dragleave', function(event) {
      event.preventDefault();
      dropArea.removeClass('dragover');
    });

    dropArea.on('drop', function(event) {
      event.preventDefault();
      dropArea.removeClass('dragover');
      const file = event.originalEvent.dataTransfer.files[0];
      handleFiles(file, dropArea, fileType);
    });

    dropArea.find('input[type="file"]').on('change', function(e) {
      const file = this.files[0];
      handleFiles(file, dropArea, fileType);
      if(fileType == 'video'){
        $('.creator-add-video-btn-wrap .btn-default').prop('disabled', false);
        $('.funcs-for-video').removeClass('disabled').addClass('active');
      }
    });
  };
 
  setupDropArea(dropAreaVideo, 'video');
  setupDropArea(dropAreaImg, 'image');

  $('form.adding-new-video').on('submit', function(){
    $('.published').addClass('active')
  })


  $('.row-coaches-bigger-slider').slick({
    slidesToShow: Math.round(document.documentElement.clientHeight / 340),
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    vertical: true,
    cssEase: 'linear'
  });

  $('.row-coaches-less-slider').slick({
      slidesToShow: Math.round(document.documentElement.clientHeight / 280),
      slidesToScroll: 1,
      arrows: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 2200,
      vertical: true,
      cssEase: 'linear'
  });

  $('.user-video-playulist--js').slick({
    slidesToShow: Number((document.documentElement.clientWidth / 400).toFixed(1)),
    slidesToScroll: Math.floor(Number((document.documentElement.clientWidth / 400).toFixed(1))),
    arrows: false,
    infinite: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Number((document.documentElement.clientWidth / 380).toFixed(1)),
          slidesToScroll: Math.floor(Number((document.documentElement.clientWidth / 380).toFixed(1))),
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ],
  });

  $('.user-video-playulist--js').on('wheel', function(e) {
    e.preventDefault();
    if (e.originalEvent.deltaY > 0) {
      $(this).slick('slickNext');
    } else {
      $(this).slick('slickPrev');
    }
    return false;
  });

  // $('.show-password').on('click', function(e){
  //   e.preventDefault();
  //   const $input = $(this).closest('.input-wrap').find('input');
  //   $input.prop('type', $input.attr('type') === 'password' ? 'text' : 'password');
  // }); /// переніс на початок бо юзер минуснувся

  $('.subscription').on('click', function(e){
    e.preventDefault();
    const subscriptionValue = $(this).text();
    $(this).text(subscriptionValue === "Subscribe" ? "Unsubscribe" : "Subscribe");
  });


  $('.show-more-post-description').on('click', function(e){
    e.preventDefault();
    const ValueAction = $(this).text();
    $('.hidden-video-post-description').toggleClass('active')
    $(this).text(ValueAction === "Show more" ? "Show less" : "Show more");
    // $(this).closest('.item-video-post-description').find('.item-video-post-description-text').html(``)
  });

  const $mainComment = $('.main-comment')
  const $demonstrativeComment = $('.replies-comment')
  $('.replies-link').on('click', function(e){
    e.preventDefault();
    $(this).closest($mainComment).find($demonstrativeComment).toggleClass('active')
  });
  $('.close-replies').on('click', function(e) {
    e.preventDefault();
    $(this).closest($mainComment).find($demonstrativeComment).removeClass('active')
  })

  const defaultText = $('.btn-show-more-user').text();

  $('.btn-show-more-user-js').on('click', function(e){
    e.preventDefault();
    $('.show-more-wrap-side-menu-link').toggleClass('active');
    const valueAction = $(this).text();
    $(this).find('.btn-show-more-user-text').text(valueAction === defaultText ? "Show less" : defaultText);
  })//TODO svg


  $('.more-func-video-main-link').on('click', function(e){
    e.preventDefault();
    $(this).closest('.more-func-video-wrap').find('.more-func-video-links').toggleClass('active');
  });
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.more-func-video-wrap').length) {
        $('.more-func-video-links').removeClass('active');
    }
  });

  $('.btn-search-header').on('click', function(e){
    e.preventDefault();

    const inputWrapSearch = $(this).closest('.input-wrap-search:not(.active)');
    inputWrapSearch.addClass('active');

    if ($(window).width() <= 600) {
      $('.btn-close-search').addClass('active', inputWrapSearch.hasClass('active'))
    }
  });
 ///1
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.input-wrap-search').length) {
        const activeInputWrap = $('.input-wrap-search.active');
        activeInputWrap.removeClass('active');

        if ($(window).width() <= 600) {
          $('.btn-close-search').removeClass('active')
        }
    }
  });
  ///////////// TODO якийсь з цих Трьох можна удалити
 ////2
  $(document).on('keydown', function(e) {
    if (e.keyCode === 27) {
        const activeInputWrap = $('.input-wrap-search.active');
        activeInputWrap.removeClass('active');

        if ($(window).width() <= 600) {
            $('.btn-close-search').removeClass('active');
        }
    }
  });
 ///3
  $('.btn-close-search').on('click', function(e) {
    e.preventDefault()
        $('.input-wrap-search.active').removeClass('active');
        $(this).removeClass('active');
  });


  $('.toogle-mobile-menu').on('click', (e)=> {
    e.preventDefault()
    $('.header-menu').toggleClass('active')
  });


  $('[name="date-birthday"]').mask("99/99/9999");
});