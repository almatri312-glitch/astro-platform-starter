"""
╔══════════════════════════════════════════╗
║   JARVIS PRO - مساعد ذكاء اصطناعي متكامل   ║
║   • بناء مواقع احترافية                    ║
║   • بحث ذكي على الإنترنت                  ║
║   • إدارة ملفات ومشاريع                   ║
╚══════════════════════════════════════════╝
"""

import os
import json
import math
import datetime
import webbrowser
import subprocess
import platform
import anthropic

# ─── الإعداد ───────────────────────────────────────────────────────
PROJECTS_DIR = "jarvis_projects"
NOTES_FILE   = "jarvis_notes.txt"

os.makedirs(PROJECTS_DIR, exist_ok=True)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# ─── تعريف الأدوات ─────────────────────────────────────────────────
TOOLS = [
    # ── بحث الإنترنت (Anthropic server-side) ──────────────────────
    {
        "type": "web_search_20260209",
        "name": "web_search",
    },

    # ── بناء موقع ─────────────────────────────────────────────────
    {
        "name": "build_website",
        "description": (
            "احفظ موقعاً ويب كاملاً (HTML + CSS + JS في ملف واحد). "
            "استخدم هذه الأداة عندما يطلب المستخدم بناء أي موقع أو صفحة ويب. "
            "يجب أن يكون الكود HTML كاملاً ومتكاملاً وجميلاً."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {
                    "type": "string",
                    "description": "اسم الملف (بدون امتداد)، مثل: portfolio أو store"
                },
                "html_content": {
                    "type": "string",
                    "description": "كود HTML كامل للموقع يتضمن CSS و JavaScript"
                },
                "description": {
                    "type": "string",
                    "description": "وصف قصير للموقع"
                }
            },
            "required": ["filename", "html_content", "description"]
        }
    },

    # ── قراءة ملف موقع ────────────────────────────────────────────
    {
        "name": "read_website",
        "description": "اقرأ كود موقع محفوظ مسبقاً لتعديله أو عرضه",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {
                    "type": "string",
                    "description": "اسم الملف (بدون امتداد)"
                }
            },
            "required": ["filename"]
        }
    },

    # ── فتح الموقع في المتصفح ─────────────────────────────────────
    {
        "name": "open_in_browser",
        "description": "افتح موقعاً محفوظاً في المتصفح",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {
                    "type": "string",
                    "description": "اسم الملف (بدون امتداد)"
                }
            },
            "required": ["filename"]
        }
    },

    # ── عرض المشاريع ──────────────────────────────────────────────
    {
        "name": "list_projects",
        "description": "اعرض قائمة بجميع المواقع والمشاريع المحفوظة",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },

    # ── الحاسبة ───────────────────────────────────────────────────
    {
        "name": "calculate",
        "description": "احسب معادلات رياضية مثل sqrt(16) أو sin(30) أو 2**10",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "المعادلة الرياضية"
                }
            },
            "required": ["expression"]
        }
    },

    # ── الوقت ─────────────────────────────────────────────────────
    {
        "name": "get_time",
        "description": "احصل على الوقت والتاريخ الحالي",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },

    # ── حفظ ملاحظة ────────────────────────────────────────────────
    {
        "name": "save_note",
        "description": "احفظ ملاحظة مهمة",
        "input_schema": {
            "type": "object",
            "properties": {
                "title":   {"type": "string", "description": "عنوان الملاحظة"},
                "content": {"type": "string", "description": "محتوى الملاحظة"}
            },
            "required": ["content"]
        }
    },

    # ── قراءة الملاحظات ───────────────────────────────────────────
    {
        "name": "read_notes",
        "description": "اقرأ جميع الملاحظات المحفوظة",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
]


# ─── تنفيذ الأدوات ─────────────────────────────────────────────────
def execute_tool(name: str, inp: dict) -> str:

    # ── بناء الموقع ───────────────────────────────────────────────
    if name == "build_website":
        fname   = inp["filename"].replace(" ", "_").replace(".html", "")
        html    = inp["html_content"]
        desc    = inp.get("description", "موقع جديد")
        path    = os.path.join(PROJECTS_DIR, f"{fname}.html")

        with open(path, "w", encoding="utf-8") as f:
            f.write(html)

        abs_path = os.path.abspath(path)
        return (
            f"✅ تم بناء الموقع بنجاح!\n"
            f"📁 الموقع: {desc}\n"
            f"📂 المسار: {abs_path}\n"
            f"🌐 افتح الملف في أي متصفح لتشاهده"
        )

    # ── قراءة موقع ────────────────────────────────────────────────
    if name == "read_website":
        fname = inp["filename"].replace(".html", "")
        path  = os.path.join(PROJECTS_DIR, f"{fname}.html")
        if not os.path.exists(path):
            return f"❌ لم يُوجد ملف باسم: {fname}.html"
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    # ── فتح في المتصفح ────────────────────────────────────────────
    if name == "open_in_browser":
        fname = inp["filename"].replace(".html", "")
        path  = os.path.join(PROJECTS_DIR, f"{fname}.html")
        if not os.path.exists(path):
            return f"❌ لم يُوجد ملف باسم: {fname}.html"
        abs_path = os.path.abspath(path)
        webbrowser.open(f"file://{abs_path}")
        return f"✅ تم فتح {fname}.html في المتصفح"

    # ── قائمة المشاريع ────────────────────────────────────────────
    if name == "list_projects":
        files = [f for f in os.listdir(PROJECTS_DIR) if f.endswith(".html")]
        if not files:
            return "📂 لا توجد مشاريع محفوظة بعد."
        result = "📂 مشاريعك:\n"
        for i, f in enumerate(files, 1):
            size = os.path.getsize(os.path.join(PROJECTS_DIR, f))
            result += f"  {i}. {f}  ({size:,} byte)\n"
        return result

    # ── الحاسبة ───────────────────────────────────────────────────
    if name == "calculate":
        safe = {k: getattr(math, k) for k in dir(math) if not k.startswith("_")}
        safe.update({"abs": abs, "round": round, "pow": pow, "int": int, "float": float})
        try:
            result = eval(inp["expression"], {"__builtins__": {}}, safe)
            return f"🧮 النتيجة: {result}"
        except Exception as e:
            return f"❌ خطأ: {e}"

    # ── الوقت ─────────────────────────────────────────────────────
    if name == "get_time":
        now = datetime.datetime.now()
        return (
            f"🕐 الوقت: {now.strftime('%I:%M %p')}\n"
            f"📅 التاريخ: {now.strftime('%A %d %B %Y')}"
        )

    # ── حفظ ملاحظة ────────────────────────────────────────────────
    if name == "save_note":
        ts      = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        title   = inp.get("title", "ملاحظة")
        content = inp["content"]
        with open(NOTES_FILE, "a", encoding="utf-8") as f:
            f.write(f"\n{'─'*40}\n[{ts}] {title}\n{content}\n")
        return f"✅ تم حفظ الملاحظة: {title}"

    # ── قراءة الملاحظات ───────────────────────────────────────────
    if name == "read_notes":
        if not os.path.exists(NOTES_FILE):
            return "📝 لا توجد ملاحظات بعد."
        with open(NOTES_FILE, "r", encoding="utf-8") as f:
            content = f.read().strip()
        return content or "📝 الملف فارغ."

    return f"⚠️ أداة غير معروفة: {name}"


# ─── System Prompt ─────────────────────────────────────────────────
SYSTEM = """أنت Jarvis، مساعد ذكاء اصطناعي متكامل ومتطور.

قدراتك:
1. 🌐 بناء مواقع ويب احترافية وجميلة بالكامل (HTML + CSS + JavaScript)
2. 🔍 بحث ذكي على الإنترنت وتلخيص المعلومات
3. 🛠️ أدوات متعددة: حاسبة، ساعة، ملاحظات، إدارة ملفات

عند بناء مواقع:
- أنشئ تصميماً حديثاً وجميلاً باستخدام CSS متقدم
- أضف JavaScript تفاعلي
- استخدم ألواناً جذابة ومتناسقة
- أجعل الموقع متجاوباً (responsive) مع الجوال
- أضف تأثيرات وأنيميشن
- كود HTML كامل في ملف واحد (embedded CSS و JS)
- لا تنسَ meta tags وtitle مناسب

عند البحث:
- ابحث بكلمات مفتاحية دقيقة
- لخّص النتائج بوضوح
- أذكر المصادر

تكلم دائماً بالعربية بأسلوب محترف وودود."""


# ─── الحلقة الرئيسية ───────────────────────────────────────────────
def main():
    conversation = []

    print()
    print("╔══════════════════════════════════════════════════╗")
    print("║          JARVIS PRO - مساعدك المتكامل           ║")
    print("╠══════════════════════════════════════════════════╣")
    print("║  🌐 بناء مواقع    🔍 بحث ذكي    🛠️ أدوات       ║")
    print("║  اكتب 'مشاريعي' لرؤية مواقعك                   ║")
    print("║  اكتب 'خروج' للإنهاء                            ║")
    print("╚══════════════════════════════════════════════════╝")
    print()

    while True:
        # ── قراءة المدخل ──────────────────────────────────────────
        try:
            user_input = input("أنت: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nJarvis: إلى اللقاء سيدي! 👋")
            break

        if not user_input:
            continue
        if user_input.lower() in ("خروج", "quit", "exit", "bye"):
            print("Jarvis: إلى اللقاء سيدي! كان من دواعي سروري مساعدتك. 👋")
            break

        # اختصار سريع
        if user_input in ("مشاريعي", "projects"):
            print(f"Jarvis: {execute_tool('list_projects', {})}\n")
            continue

        conversation.append({"role": "user", "content": user_input})

        print("Jarvis: جاري المعالجة...", end="\r")

        # ── حلقة الأداة ───────────────────────────────────────────
        while True:
            response = client.messages.create(
                model="claude-opus-4-8",
                max_tokens=8192,
                system=SYSTEM,
                tools=TOOLS,
                messages=conversation,
            )

            # انتهاء الرد
            if response.stop_reason == "end_turn":
                text = "".join(
                    b.text for b in response.content if hasattr(b, "text")
                )
                print(f"\rJarvis: {text}\n")
                conversation.append({"role": "assistant", "content": response.content})
                break

            # طلب أداة
            if response.stop_reason == "tool_use":
                conversation.append({"role": "assistant", "content": response.content})
                tool_results = []

                for block in response.content:
                    if block.type == "tool_use":
                        # عرض ما يفعله Jarvis
                        icons = {
                            "web_search":    "🔍 يبحث على الإنترنت",
                            "build_website": "🏗️  يبني الموقع",
                            "open_in_browser":"🌐 يفتح المتصفح",
                            "list_projects": "📂 يعرض المشاريع",
                            "calculate":     "🧮 يحسب",
                            "get_time":      "🕐 يتحقق من الوقت",
                            "save_note":     "📝 يحفظ ملاحظة",
                            "read_notes":    "📖 يقرأ الملاحظات",
                            "read_website":  "📄 يقرأ الموقع",
                        }
                        action = icons.get(block.name, f"⚙️  {block.name}")
                        print(f"\rJarvis: [{action}...]        ", end="\r")

                        # تنفيذ الأداة
                        result = execute_tool(block.name, block.input)

                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })

                conversation.append({"role": "user", "content": tool_results})

            else:
                # stop_reason غير متوقع
                break


# ─── نقطة الدخول ───────────────────────────────────────────────────
if __name__ == "__main__":
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("❌ خطأ: يجب تعيين ANTHROPIC_API_KEY")
        print("   export ANTHROPIC_API_KEY='your-key-here'")
        raise SystemExit(1)
    main()
