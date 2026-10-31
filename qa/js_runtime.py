"""Run small browser-independent interaction checks with macOS JavaScriptCore."""
import ctypes as C


class JavaScript:
    def __init__(self):
        self.lib = C.CDLL('/System/Library/Frameworks/JavaScriptCore.framework/JavaScriptCore')
        def bind(name, result, args):
            fn = getattr(self.lib, name)
            fn.restype, fn.argtypes = result, args
            return fn
        ptr = C.c_void_p
        self.context = bind('JSGlobalContextCreate', ptr, [ptr])(None)
        self.string = bind('JSStringCreateWithUTF8CString', ptr, [C.c_char_p])
        self.release = bind('JSStringRelease', None, [ptr])
        self.evaluate = bind('JSEvaluateScript', ptr, [ptr, ptr, ptr, ptr, C.c_int, C.POINTER(ptr)])
        self.as_string = bind('JSValueToStringCopy', ptr, [ptr, ptr, C.POINTER(ptr)])
        self.size = bind('JSStringGetMaximumUTF8CStringSize', C.c_size_t, [ptr])
        self.utf8 = bind('JSStringGetUTF8CString', C.c_size_t, [ptr, C.c_char_p, C.c_size_t])

    def text(self, value):
        string = self.as_string(self.context, value, None)
        buffer = C.create_string_buffer(self.size(string))
        self.utf8(string, buffer, len(buffer))
        self.release(string)
        return buffer.value.decode()

    def run(self, code):
        string, error = self.string(code.encode()), C.c_void_p()
        value = self.evaluate(self.context, string, None, None, 1, C.byref(error))
        self.release(string)
        if error.value:
            raise RuntimeError(self.text(error))
        return self.text(value)
