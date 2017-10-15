/**
 *
 */


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


_event();

// 游戏内事件处理
function _event() {

    $('#goScreen2').click(function () {

        $('#screen1').hide()

        $('#screen2').show()

        var auotPro, i = 0;

        var timeFn = function () {

            i = i + 1

            $('#process').css('width', i + '%');

            $('#process p').text(i + '%')

            if (i == 100) {

                clearInterval(auotPro);

                $('#goScreen3').show()

                // setTimeout(function () {
                //

                //
                //
                // }, 8000)

            }

        };

        auotPro = setInterval(timeFn, 100);


    });

    $('#goScreen3').click(function () {

            $('#screen2').remove()

            $('#screenPart').show()

            _setPart()

            _moveZoo()

            // _time(45, function () {
            //     _over()
            // })

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

        $('#screenPart').hide()

        clearInterval(autoTime)

    })

    $('[data-role="out"]').click(function () {

        _out()
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
        console.log('touchstart')
    });

    $('#movePart').on('touchmove', function (e) {

        console.log('touchmove')
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

        setTimeout(function () {

            if (curIsTure == "yes") {

                $('#subPro i').eq(curSub).addClass("active")

                curSub = curSub + 1

                scoreSum = scoreSum + 100

                setCorrect = setCorrect + 1

                if (curSub >= 4) {

                    scoreSum = scoreSum + 50;

                    level = level + 1

                    $('#subPro i').removeClass("active")

                    curSub = 0

                }

            }
            else if (curIsTure == "no") {

                $('#subPro i').removeClass("active")

                curSub = 0

            }


            setNum = setNum + 1

            $('#score').text(scoreSum)

            $('#level').text(level)

            _setPart(scoreSum)

        }, 500)


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

                $('#screenPart').show()

                _time($('#time').text(), function () {

                    _over()

                })
            }

        }
        else if ($move == 'left') {


            if ($moveIndex > 0) {

                $moveIndex = $moveIndex - 1

                $('#helpBox ul.help-list').css('left', -$w * $moveIndex)

            }

        }
        console.log('$moveIndex', $moveIndex)

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

    $('#zoo').empty()

    $('#zoo').removeClass().addClass('part-list')

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

        $('#zoo').append('<li class="' + $zoo[i] + '">')

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


//游戏结束
function _over() {

    $('#screenPart').remove()

    $('#overBox').show()

    $('#getScore').text(scoreSum)

    $('#getNum').text(setNum)

    var $perc = (setCorrect / setNum).toFixed(4) * 100

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
