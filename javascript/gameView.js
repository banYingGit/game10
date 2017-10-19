/* 全局变量
 * autoTime：倒计时
 * layout：界面排列方式
 * dog ：狗
 * sheep：羊
 * curDir：当前方向
 * moveDir：移动方向 > 'dt', 'dr', 'db', 'dl'
 * curSub: 当前答题数
 * curIsTure: 当前正确否
 * level: 当前水平
 * scoreSum：总得分
 * setNum: 记录判断次数不记对错
 * setCorrect: 记录判断正确个数
 */

var autoTime,
    layout = ['part-list1', 'part-list2', 'part-list3', 'part-list4', 'part-list5', 'part-list6', 'part-list7'],
    dog = ['dt', 'dr', 'db', 'dl'],
    sheep = ['st', 'sr', 'sb', 'sl'],
    curDir = '',
    moveDir = '',
    curSub = 0,
    curIsTure,
    level = 0,
    scoreSum = 0,
    setNum = 0,
    setCorrect = 0;


var dagAnimation, textAnimation, flamesAnimation, iconAnimation

_event();


// 游戏内事件处理
function _event() {


    $('div[data-role="confirmExit"]').click(function () {

        $('#sureBox').show()

    });


    $('#goScreen2').click(function () {

        $('#screen1').hide()

        $('#screen2').show()

        var auotPro, i = 0;

        var timeFn = function () {

            i = i + 1

            $('#process').css('width', i + '%');

            $('#process p').text(i + '%');

            if (i == 100) {

                clearInterval(auotPro);

                $('#goScreen3').show()

            }

        };

        //100>>>>>10
        auotPro = setInterval(timeFn, 10);


    });

    $('#goScreen3').click(function () {

        $('#screen2').remove()

        $('#screenPart').show()

        _setPart()

        $('#screenPart').css({'pointer-events': "none"})

        setTimeout(function () {

            $('#introduceBox').show()

        }, 1000)


    });

    $('#introduceContinue').click(function () {

        $('#introduceBox').remove()

        $('#screenPart').css({'pointer-events': ""})
        _moveZoo()

        _time(45, function () {
            _over()
        })

    });


    $('#stop').click(function () {

        clearInterval(autoTime)


        $('#stopBox').show()

    })

    $('#continue').click(function () {

        $('#stopBox').hide()

        _time($('#time').text(), function () {

            _over()

        })

    })

    $('#out').click(function () {

        $('#sureBox').show()

        clearInterval(autoTime)

    })

    $('#cancelOut').click(function () {

        $('#sureBox').hide()

        _time($('#time').text(), function () {

            _over()

        })

    })

    $('#help').click(function () {

        $('#helpBox').show()

        clearInterval(autoTime)

    })

    $('[data-role="out"]').click(function () {

        _out()
    })

    $('#cancelOut').click(function () {

        $('#sureBox').hide()

    })

    _moveHelp()

}

//动物园里滑动
function _moveZoo() {

    var startX, startY, endX, endY, distanceX, distanceY;

    $('#movePart').on('touchstart', function (e) {

        var touch = e.originalEvent.touches[0];

        startX = touch.pageX;

        startY = touch.pageY;

        curIsTure = ""
    });

    $('#movePart').on('touchmove', function (e) {

        var touch = e.originalEvent.touches[0];

        //获取滑动屏幕时的X,Y
        endX = touch.pageX;
        endY = touch.pageY;
        //获取滑动距离
        distanceX = endX - startX;
        distanceY = endY - startY;

        // console.log('endX', endX)
        // console.log('endY', endY)
        // console.log('distanceX', distanceX)
        // console.log('distanceY', distanceY)
        _where(distanceX, distanceY, function () {


            if (moveDir == curDir) {

                curIsTure = "yes"


            } else if (moveDir != curDir) {

                curIsTure = "no"

            }

            $('#screenPart').css({'pointer-events': 'none'})

        })


    })

    $('#movePart').on('touchend', function () {


        if (curIsTure == '') return;

        var $elD = $('img[data-role="d"]'),

            $srcD = $elD.parent('p').attr('class');

        $('img[data-role="d"]').parent('p').append('<span id="language" class="language"><img src=""></span>')

        var $elLanguage = $('#language').children("img");

        clearInterval(iconAnimation)

        clearInterval(flamesAnimation)


        if (curIsTure == "yes") {

            var screenH = $(document).height()

            $('img[data-role="d"]').parent('p').append('<span class="add"  style="font-size: ' + screenH / 18 + 'px">+ 100</span>')

            $('img[data-role="d"]').parent('p').children('.add').animate({"opacity": 0}, 1000)

            $('#subPro img').eq(curSub).attr("src", "img/icon1.png")

            curSub = curSub + 1

            scoreSum = scoreSum + 100

            setCorrect = setCorrect + 1

            var $srcDCom = "img/success/" + $srcD + "/d_";

            var $srcLanguage = "img/success/text/wang_";

            _dagAnimation($elD, 24, $srcDCom);

            _textAnimation($elLanguage, $srcLanguage)


            if (curSub >= 4) {

                scoreSum = scoreSum + 50;

                level = level + 1;

                _flamesAnimation()

                _iconAnimation()

                curSub = 0

            } else if (curSub == 1) {

                $('#subPro img').attr("src", "img/icon1s.png")

                $('#subPro img').eq(0).attr("src", "img/icon1.png")

                $('#fire').attr("src", "img/icon3.png")

            }


        }
        else if (curIsTure == "no") {

            $('#subPro img').attr("src", "img/icon1s.png")

            curSub = 0;

            var $srcDCom = "img/error/" + $srcD + "/d_";

            var $srcLanguage = "img/error/text/wu_";

            _dagAnimation($elD, 13, $srcDCom);

            _textAnimation($elLanguage, $srcLanguage)

        }


        setNum = setNum + 1

        $('#score').text(scoreSum)

        $('#level').text(level)

        setTimeout(function () {


            _setPart(scoreSum)

        }, 1500)


    })


}

function _moveHelp() {

    var $w = $(document).width()


    var startX, startY, endX, endY, distanceX, distanceY, $move, $moveIndex = 0;

    $('#helpBox').on('touchstart', function (e) {

        var touch = e.originalEvent.touches[0];

        startX = touch.pageX;

        startY = touch.pageY;
    });

    $('#helpBox').on('touchmove', function (e) {

        var touch = e.originalEvent.touches[0];

        //获取滑动屏幕时的X,Y
        endX = touch.pageX;
        endY = touch.pageY;
        //获取滑动距离
        distanceX = endX - startX;
        distanceY = endY - startY;

        _where(distanceX, distanceY, function () {


            if (moveDir == 'dl') {

                $move = "left"


            }

            else if (moveDir == 'dr') {

                $move = "right"

            }


        })


    })

    $('#helpBox').on('touchend', function () {


        if ($move == 'right') {


            if ($moveIndex < 2) {

                $moveIndex = $moveIndex + 1

                $('#helpBox ul.help-list').css('left', -$w * $moveIndex)

            } else if ($moveIndex >= 2) {
                $('#helpBox').hide()

            }

        }
        else if ($move == 'left') {


            if ($moveIndex > 0) {

                $moveIndex = $moveIndex - 1

                $('#helpBox ul.help-list').css('left', -$w * $moveIndex)

            }

        }
        // console.log('$moveIndex', $moveIndex)

        $('#spot li').removeClass('active')
        $('#spot li').eq($moveIndex).addClass('active')


    })


}

/*** 判断滑动方向
 * x：x距离
 * y：y距离
 * fn：回调
 ***/
function _where(x, y, fn) {

    if (Math.abs(x) > Math.abs(y) && x > 0) {

        fn && fn.call(this)

        moveDir = 'dr'


    } else if (Math.abs(x) > Math.abs(y) && x < 0) {

        fn && fn.call(this)
        moveDir = 'dl'


    } else if (Math.abs(x) < Math.abs(y) && y < 0) {

        fn && fn.call(this)
        moveDir = 'dt'


    } else if (Math.abs(x) < Math.abs(y) && y > 0) {


        moveDir = 'db'
        fn && fn.call(this)

    } else {

        moveDir = ''

        fn && fn.call(this)
    }
}

function _setPart() {

    $('#zoo').empty().removeClass().addClass('part-list')

    $('#screenPart').css({'pointer-events': ''})

    //选出 > 排列方式 > 狗  >  羊
    var $layout = _getArrayItems(layout, 1),

        $dog = _getArrayItems(dog, 1),

        $sheep = _getArrayItems(sheep, 1);

    // 合并羊与狗
    var zoo = $sheep.concat($sheep).concat($sheep).concat($sheep).concat($dog),

        $zoo = _getArrayItems(zoo, 5)

    curDir = $dog[0]

    $('#zoo').addClass($layout[0])

    for (var i = 0; i < $zoo.length; i++) {

        console.log(' $zoo[i].substr(0, 0)', $zoo[i].substr(0, 1))

        $('#zoo').append('<p  class="' + $zoo[i] + '" ><img src="img/' + $zoo[i] + '.png"  data-role="' + $zoo[i].substr(0, 1) + '"></p>')

    }

    var screenH = $(document).height()

    $('.part-list li').css({'width': screenH / 4, 'height': screenH / 4})


}

/*** 倒计时
 * i：时间
 * fn：倒计时结束回调
 ***/
function _time(i, fn) {


    var timeFn = function () {

        i = i - 1

        $('#time').text(i)

        if (i == 0) {

            clearInterval(autoTime)

            fn && fn.call(this)

        }

    }

    autoTime = setInterval(timeFn, 1000);

}


/*** 数组随机
 * arr：数组
 * num：随机个数
 ***/
function _getArrayItems(arr, num) {

    var array = [];

    for (var index in arr) {

        array.push(arr[index]);
    }

    var return_array = [];

    for (var i = 0; i < num; i++) {

        if (array.length > 0) {

            var arrIndex = Math.floor(Math.random() * array.length);

            return_array[i] = array[arrIndex];

            array.splice(arrIndex, 1);

        } else {
            break;
        }
    }
    return return_array;
}


/*** _dagAnimation 小狗动画
 * el  元素
 * num：帧数
 * src: 图片路径
 ***/
function _dagAnimation(el, num, src) {

    var $el = el,

        lastTime = Date.now(),

        deltaTime = 0,

        jianGeTime = 0,

        imgIndex = 0;

    dagAnimation = function () {

        window.requestAnimationFrame(dagAnimation);

        var now = Date.now();

        deltaTime = now - lastTime;

        lastTime = Date.now();

        jianGeTime += deltaTime;

        if (jianGeTime > 30) {

            jianGeTime = 0;

            imgIndex++;

            if (imgIndex > num) imgIndex = 0;


            $el.attr('src', src + imgIndex + ".png");
        }
    };

    dagAnimation();

}

/*** _textAnimation 小狗语言动画
 * el  元素
 * src: 图片路径
 ***/
function _textAnimation(el, src) {

    var $el = el,

        lastTime = Date.now(),

        deltaTime = 0,

        jianGeTime = 0,

        imgIndex = 0;

    textAnimation = function () {

        window.requestAnimationFrame(textAnimation);

        var now = Date.now();

        deltaTime = now - lastTime;

        lastTime = Date.now();

        jianGeTime += deltaTime;

        if (jianGeTime > 300) {

            jianGeTime = 0;

            imgIndex++;

            if (imgIndex > 2) {

                imgIndex = imgIndex - 1;

                $el.animate({'opacity': 0}, 500)
            }

            $el.attr('src', src + imgIndex + ".png");
        }
    };

    textAnimation();

}


function _flamesAnimation() {

    var $el = $('#fire'),

        indexI = 0;


    var flamesFn = function () {

        indexI = indexI + 1;

        $el.attr('src', "img/flames/f_" + indexI + ".png");

        if (indexI >= 16) {

            indexI = 0;

            // clearInterval(flamesAnimation)
        }

    };

    flamesAnimation = setInterval(flamesFn, 100);

}


function _iconAnimation() {


    var $el = $('#subPro img'),

        indexI = 0;


    var iconFn = function () {

        indexI = indexI + 1;

        $el.attr('src', "img/icon1/i_" + indexI + ".png");

        if (indexI >= 9) {

            indexI = 0;

            // clearInterval(iconAnimation)

        }
    };

    iconAnimation = setInterval(iconFn, 100);


}

//游戏结束
function _over() {

    $('#screenPart').remove()

    $('#overBox').show()

    $('#getScore').text(scoreSum)

    $('#getNum').text(setNum)

    var $perc = (setCorrect / setNum).toFixed(4) * 100

    console.log('$perc', $perc)

    $('#getPerc').text($perc + '%')


    /* ajax 请求接口路径，返回json 数据
     * scoreSum: 总得分
     * setNum: 总答题次数
     * percentage：正确率
     * */


    var param = {
        scoreSum: scoreSum,
        setNum: setNum,
        percentage: $perc + '%'

    }

    console.log('当前返回参数', JSON.stringify(param))

}

//游戏退出
function _out() {

    console.log('游戏退出')

}
