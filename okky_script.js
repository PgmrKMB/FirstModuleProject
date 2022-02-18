
$(function () {
    let _surveyAfter = false;
    let _survey = false;
    let isSend = false;
    let $surveyResetContainer = $("#survey-reset-btn").parent();
    let $surveySubmitBtn = $("#survey-submit-btn");
    let $surveyLayout = $("#survey-layout");
    let resizeSurveyHeight = function () {
        let surveyHeight = Math.max($(document).height(), $(window).height());
        $surveyLayout.height(surveyHeight);
    }
    let validate = function () {
        let length = $("input[name=a1]:checked").add("input[name=a2]:checked").length;
        if (length === 2) {
            $surveySubmitBtn.addClass("bg-indigo-600").removeClass("bg-gray-400").attr("disabled", false);
            return true;
        }
        $surveySubmitBtn.addClass("bg-gray-400").removeClass("bg-indigo-600").attr("disabled", true);
        return false;
    };
    let isMobile = function () {
        const mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
        const tabletRE = /android|ipad|playbook|silk/i;
        let agent = navigator.userAgent;
        return mobileRE.test(agent) || tabletRE.test(agent);
    }
    let getHelpLink = function () {
        let agent = navigator.userAgent.toLowerCase();
        let browsers = ["samsung", "edge", "edg", "crios", "chrome", "trident", "firefox", "safari"];
        let links = {
            "chrome": {
                "pc": "https://support.google.com/chrome/answer/95647?hl=ko",
                "mobile": "https://support.google.com/chrome/answer/95647?hl=ko&co=GENIE.Platform%3DAndroid"
            },
            "safari": {
                "pc": "https://support.apple.com/ko-kr/guide/safari/sfri11471/mac",
                "mobile": "https://support.apple.com/ko-kr/HT201265",
            },
            "edge": {
                "pc": "https://support.microsoft.com/ko-kr/microsoft-edge/microsoft-edge%EC%97%90%EC%84%9C-%EC%BF%A0%ED%82%A4-%EB%B0%8F-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%9E%84%EC%8B%9C-%ED%97%88%EC%9A%A9-597f04f2-c0ce-f08c-7c2b-541086362bd2",
                "mobile": "https://support.microsoft.com/ko-kr/microsoft-edge/microsoft-edge%EC%97%90%EC%84%9C-%EC%BF%A0%ED%82%A4-%EB%B0%8F-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%9E%84%EC%8B%9C-%ED%97%88%EC%9A%A9-597f04f2-c0ce-f08c-7c2b-541086362bd2"
            },
            "firefox": {
                "pc": "https://support.mozilla.org/ko/kb/websites-say-cookies-are-blocked-unblock-them",
                "mobile": "https://support.mozilla.org/ko/kb/websites-say-cookies-are-blocked-unblock-them"
            },
            "ie": {
                "pc": "https://support.microsoft.com/ko-kr/windows/%EC%BF%A0%ED%82%A4-%EC%82%AD%EC%A0%9C-%EB%B0%8F-%EA%B4%80%EB%A6%AC-168dab11-0753-043d-7c16-ede5947fc64d",
                "mobile": "https://support.microsoft.com/ko-kr/windows/%EC%BF%A0%ED%82%A4-%EC%82%AD%EC%A0%9C-%EB%B0%8F-%EA%B4%80%EB%A6%AC-168dab11-0753-043d-7c16-ede5947fc64d"
            },
            "samsung": {
                "pc": "https://www.samsungsvc.co.kr/solution/36723",
                "mobile": "https://www.samsungsvc.co.kr/solution/36723"
            }
        }
        let checkMobile = isMobile();
        let browser = "chrome";
        for (let i = 0; i < browsers.length; i++) {
            if (agent.indexOf(browsers[i]) !== -1) {
                browser = browsers[i];
                if (browsers[i] !== "chrome") {
                    break;
                } else if (browsers[i] === "chrome" && !!window.chrome) {
                    break;
                }
            }
        }
        if (browser.startsWith("edg")) {
            browser = "edge";
        } else if (browser.startsWith("trident")) {
            browser = "ie";
        } else if (browser.startsWith("crios")) {
            browser = "chrome";
        }

        return links[browser][checkMobile ? 'mobile' : 'pc'];
    }
    if (!_surveyAfter && !_survey) {
        $surveyLayout.find("input[type=radio]").prop("checked", false);
        $surveyLayout.find("input[type=text]").val("");
        let dataMap = {
            "1": "qna",
            "2": "tech",
            "3": "community",
            "4": "column",
            "5": "jobs"
        };
        let $surveyIntro = $("#survey-intro");
        let $surveyMain = $("#survey-main");
        let $surveyResult = $("#survey-result");
        let $surveyForm = $("#survey-form");
        let initResult = function (data) {
            $surveyResult.find("[data-result]").each(function () {
                let result = $(this).data("result");
                $(this).find(".gauge").each(function (i) {
                    let key = dataMap[i + 1] + "Ratio";
                    let ratio = (data[result][key] ? data[result][key].toFixed(0) : 0) + "%";
                    $(this).width(ratio);
                    $(this).find("span").text(ratio);
                });
            });
        }
        let toggleResultText = function (count) {
            let $resultText = $surveyResult.find(".result-text");
            $resultText.hide();
            if (count > 0) {
                $resultText.eq(0).find("span").text(count.toLocaleString());
                $resultText.eq(0).show();
            } else {
                $resultText.eq(1).show();
            }
        }

        $surveyLayout.find(".default-cookie-option-link").attr("href", getHelpLink());

        // prevent user-scalable
        let viewportMetaEl = document.querySelector('meta[name="viewport"]');
        let prevViewportMeta = viewportMetaEl.getAttribute('content');
        viewportMetaEl.setAttribute('content', 'width=device-width, user-scalable=no');

        resizeSurveyHeight();
        $surveyLayout.show();
        setTimeout(resizeSurveyHeight, 1000);

        $("#survey-intro-btn").on("click", function () {
            $surveyIntro.hide();
            $("#vote2").removeAttr("style");
            $surveyMain.show();
        });

        $surveySubmitBtn.on("click", function () {
            if (!isSend) {
                if (!validate()) {
                    return;
                }
                let $surveyA3 = $surveyForm.find("input[name=a3]");
                if ($surveyA3.val().length > 0) {
                    $surveyA3.val($surveyA3.val().substring(0, 1000));
                }
                $.ajax({
                    url: "/survey",
                    type: "post",
                    data: $surveyForm.serialize(),
                    success: function (r) {
                        isSend = true;
                        $surveyMain.hide();
                        initResult(r);
                        toggleResultText(r.id);
                        $surveyResult.show();

                        // scroll top after submit
                        $('html, body').animate({
                            scrollTop: 0
                        }, 1000);
                    },
                    error: function (r) {
                        if (r.status === 403) {
                            alert("이미 투표했습니다.");
                        } else if (r.status === 400) {
                            isSend = false;
                            alert("설문조사의 필수 값을 선택해주세요!");
                        } else if (r.status === 500) {
                            isSend = false;
                            alert("설문조사 보내기에 실패했습니다.\n잠시 후 다시 시도해주세요.\n문제가 지속될 경우 관리자(info@okky.kr)에게 문의 부탁드립니다.");
                        } else {
                            isSend = false;
                            alert("알 수 없는 오류가 발생했습니다.\n문제가 지속될 경우 관리자(info@okky.kr)에게 문의 부탁드립니다.");
                        }
                    }
                });
            }
        });

        $("#survey-close-btn").on("click", function () {
            $surveyLayout.hide();
            $surveyResetContainer.show();
            // when closed vote dialog, rollback content attribute of viewport meta
            viewportMetaEl.setAttribute('content', prevViewportMeta);
        });

        $("#survey-after-btn").on("click", function () {
            $surveyLayout.hide();
            $surveyResetContainer.show();
            $.post("/survey/close");
            viewportMetaEl.setAttribute('content', prevViewportMeta);
        });

        $("input[name=a1]").add("input[name=a2]").on("click", function () {
            validate();…