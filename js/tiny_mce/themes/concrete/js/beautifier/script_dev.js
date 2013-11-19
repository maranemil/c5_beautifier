(function($) {
    $(document).ready(function() {
        var the = {
            beautify_in_progress: false
        };
        if (/chrome/.test(navigator.userAgent.toLowerCase())) {
            String.prototype.old_charAt = String.prototype.charAt;
            String.prototype.charAt = function(n) {
                return this.old_charAt(n)
            }
        }
        function any(a, b) {
            return a || b
        }
        function unpacker_filter(source) {
            var trailing_comments = "";
            var comment = "";
            var found = false;
            do {
                found = false;
                if (/^\s*\/\*/.test(source)) {
                    found = true;
                    comment = source.substr(0, source.indexOf("*/") + 2);
                    source = source.substr(comment.length).replace(/^\s+/, "");
                    trailing_comments += comment + "\n"
                } else if (/^\s*\/\//.test(source)) {
                    found = true;
                    comment = source.match(/^\s*\/\/.*/)[0];
                    source = source.substr(comment.length).replace(/^\s+/, "");
                    trailing_comments += comment + "\n"
                }
            } while (found);
            if (P_A_C_K_E_R.detect(source)) source = unpacker_filter(P_A_C_K_E_R.unpack(source));
            if (Urlencoded.detect(source)) source = unpacker_filter(Urlencoded.unpack(source));
            if (JavascriptObfuscator.detect(source)) source = unpacker_filter(JavascriptObfuscator.unpack(source));
            if (MyObfuscate.detect(source)) source = unpacker_filter(MyObfuscate.unpack(source));
            return trailing_comments + source
        }
        function beautify() {
            if (the.beautify_in_progress) return;
            the.beautify_in_progress = true;
            $(".loading").show();
            var source = $("#js_code").val();
            var indent_size = $("#tabsize").val();
            var indent_char = indent_size == 1 ? "\t" : " ";
            var preserve_newlines = $("#preserve-newlines").attr("checked");
            var keep_array_indentation = $("#keep-array-indentation").attr("checked");
            var brace_style = $("#brace-style").val();
            if ($("#detect-packers").attr("checked")) source = unpacker_filter(source);
            var comment_mark = "<-" + "-";
            var opts = {
                indent_size: indent_size,
                indent_char: indent_char,
                preserve_newlines: preserve_newlines,
                brace_style: brace_style,
                keep_array_indentation: keep_array_indentation,
                space_after_anon_function: true
            };
            if (source && source[0] === "<" && source.substring(0, 4) !== comment_mark) $("#js_code").val(style_html(source, opts));
            else {
                var v = js_beautify(unpacker_filter(source), opts);
                $("#js_code").val(v)
            }
            $("#js_code").select();
            $(".loading").hide();
            the.beautify_in_progress = false
        }
        $(function() {
            var default_text = "Paste your JavaScript or jQuery code here.";
            $("#js_code").val(default_text).bind("click focus", function() {
                if ($(this).val() == default_text) $(this).val("")
            }).bind("blur", function() {
                if (!$(this).val()) $(this).val(default_text)
            });
            $(window).bind("keydown", function(e) {
                if (e.ctrlKey && e.keyCode == 13) beautify()
            });
            $("#submit").bind("click", function(e) {
                e.preventDefault();
                beautify()
            });
            $("select").bind("change", function(e) {
                e.preventDefault();
                beautify()
            })
        });
        var defaultSourceTxt = "Paste your JavaScript or jQuery code here.";
        $.getScript("js/social-share.js");
        $('textarea[name="js_code"]').bind("click", function(e) {
            if ($(this).val() == defaultSourceTxt) $(this).val("")
        }).bind("blur", function(e) {
            if ($(this).val() == "") $(this).val(defaultSourceTxt);
            else $("#reset-btn").show()
        });
        $("#reset-btn").bind("click", function(e) {
            e.preventDefault();
            $('textarea[name="js_code"]').val(defaultSourceTxt);
            $(this).hide()
        })
    })
})(jQuery);