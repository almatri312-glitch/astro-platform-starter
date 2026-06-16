"""
Jarvis المتقدم - مع أدوات (Tools) مثل: الوقت، الحسابات، البحث في الملفات
"""

import os
import json
import math
import datetime
import anthropic

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# ─── تعريف الأدوات ────────────────────────────────────────────────
TOOLS = [
    {
        "name": "get_current_time",
        "description": "يعطيك الوقت والتاريخ الحالي",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "المنطقة الزمنية (اختياري، مثل: Asia/Riyadh)"
                }
            },
            "required": []
        }
    },
    {
        "name": "calculate",
        "description": "يحل العمليات الحسابية والرياضية",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "التعبير الرياضي، مثل: 2 + 2 أو sqrt(16) أو sin(30)"
                }
            },
            "required": ["expression"]
        }
    },
    {
        "name": "save_note",
        "description": "يحفظ ملاحظة في ملف notes.txt",
        "input_schema": {
            "type": "object",
            "properties": {
                "content": {
                    "type": "string",
                    "description": "محتوى الملاحظة"
                },
                "title": {
                    "type": "string",
                    "description": "عنوان الملاحظة (اختياري)"
                }
            },
            "required": ["content"]
        }
    },
    {
        "name": "read_notes",
        "description": "يقرأ الملاحظات المحفوظة",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
]


# ─── تنفيذ الأدوات ────────────────────────────────────────────────
def execute_tool(tool_name: str, tool_input: dict) -> str:
    if tool_name == "get_current_time":
        now = datetime.datetime.now()
        return f"الوقت الحالي: {now.strftime('%I:%M %p')} | التاريخ: {now.strftime('%A، %d %B %Y')}"

    if tool_name == "calculate":
        expr = tool_input["expression"]
        # نسمح فقط بعمليات آمنة
        safe_names = {k: getattr(math, k) for k in dir(math) if not k.startswith("_")}
        safe_names.update({"abs": abs, "round": round, "pow": pow})
        try:
            result = eval(expr, {"__builtins__": {}}, safe_names)
            return f"النتيجة: {result}"
        except Exception as e:
            return f"خطأ في الحساب: {e}"

    if tool_name == "save_note":
        title = tool_input.get("title", "ملاحظة")
        content = tool_input["content"]
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        note = f"\n{'='*40}\n[{timestamp}] {title}\n{content}\n"
        with open("notes.txt", "a", encoding="utf-8") as f:
            f.write(note)
        return f"تم حفظ الملاحظة بعنوان: {title}"

    if tool_name == "read_notes":
        if not os.path.exists("notes.txt"):
            return "لا توجد ملاحظات محفوظة بعد."
        with open("notes.txt", "r", encoding="utf-8") as f:
            content = f.read().strip()
        return content if content else "الملف فارغ."

    return f"أداة غير معروفة: {tool_name}"


# ─── حلقة Jarvis الرئيسية ─────────────────────────────────────────
def jarvis_loop():
    conversation = []
    system = (
        "أنت Jarvis، مساعد ذكاء اصطناعي شخصي متطور. "
        "لديك أدوات للوقت والحسابات وحفظ الملاحظات. "
        "استخدم الأدوات تلقائياً عند الحاجة دون أن تطلب إذناً."
    )

    print("=" * 50)
    print("  JARVIS المتقدم - مع أدوات ذكية")
    print("  أدواتي: الوقت | الحسابات | الملاحظات")
    print("  اكتب 'خروج' للإنهاء")
    print("=" * 50)
    print()

    while True:
        try:
            user_input = input("أنت: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nJarvis: إلى اللقاء!")
            break

        if not user_input:
            continue
        if user_input.lower() in ("خروج", "quit", "exit"):
            print("Jarvis: إلى اللقاء، سيدي!")
            break

        conversation.append({"role": "user", "content": user_input})

        # حلقة الأداة
        while True:
            response = client.messages.create(
                model="claude-opus-4-8",
                max_tokens=2048,
                system=system,
                tools=TOOLS,
                messages=conversation,
            )

            if response.stop_reason == "end_turn":
                text = next(
                    (b.text for b in response.content if hasattr(b, "text")), ""
                )
                print(f"Jarvis: {text}\n")
                conversation.append({"role": "assistant", "content": response.content})
                break

            if response.stop_reason == "tool_use":
                conversation.append({"role": "assistant", "content": response.content})
                tool_results = []

                for block in response.content:
                    if block.type == "tool_use":
                        print(f"  [Jarvis يستخدم: {block.name}]")
                        result = execute_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })

                conversation.append({"role": "user", "content": tool_results})
            else:
                break


if __name__ == "__main__":
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("خطأ: يجب تعيين ANTHROPIC_API_KEY")
        exit(1)
    jarvis_loop()
