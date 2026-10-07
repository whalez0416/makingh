"""글꼴 경량화 (2026-10-07) — 본문 Pretendard Variable·제목 명조 Noto Serif KR 을 홈페이지에 실제 쓰는 글자만 남긴 파일 하나씩으로.

화면 한 장에 글꼴 조각 19~24개(약 500KB)를 받던 것을 1개로 줄인다.
목록에 없는 글자(관리자에서 새로 쓴 드문 글자)는 globals.css 의 다음 글꼴(Pretendard 조각 전체)이 그 글자만 받아 그린다 — 깨지지 않는다.
글자 출처: messages/*.json · src 문자열 · 라이브 사이트맵 전 페이지 본문(관리자 글 포함).
문구를 많이 바꾸거나 새 페이지를 만들면 다시 돌린다:  python scripts/font-subset.py   (pip install fonttools brotli)
"""
import pathlib, re, urllib.parse, urllib.request
from fontTools import subset

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2'
OUT = ROOT / 'src/fonts/pretendard-site.woff2'
SERIF = ROOT / 'src/fonts/serif-kr-site.woff2'

chars = set(chr(c) for c in range(0x20, 0x7F))        # ASCII
chars |= set(chr(c) for c in range(0xA0, 0x100))      # Latin-1
chars |= set('‘’“”·…–—→←↑↓➞×※○●◆■□△▲▶◀♡★☆™®©°₩€%~')
for p in [*ROOT.glob('messages/*.json'), *ROOT.glob('src/**/*.ts*')]:
    chars |= set(p.read_text(encoding='utf-8'))
try:  # 라이브 페이지 본문 (관리자에서 넣은 소식·후기·병원정보 글자)
    sm = urllib.request.urlopen('https://dittocellseoul.com/sitemap.xml', timeout=20).read().decode()
    for u in re.findall(r'<loc>([^<]+)</loc>', sm):
        chars |= set(urllib.request.urlopen(u, timeout=20).read().decode('utf-8', 'ignore'))
except Exception as e:
    print('라이브 페이지를 못 읽음(코드 글자만 사용):', e)

text = ''.join(sorted(c for c in chars if c.isprintable()))
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['*']
opts.name_IDs = ['*']
opts.notdef_outline = True
font = subset.load_font(str(SRC), opts)
sub = subset.Subsetter(opts)
sub.populate(text=text)
sub.subset(font)
subset.save_font(font, str(OUT), opts)
hangul = sum('가' <= c <= '힣' for c in text)
print(f'{OUT.name}: 한글 {hangul}자, {OUT.stat().st_size // 1024}KB')

# 제목 명조 — Google Fonts 의 text= 로 같은 글자만 담은 파일 한 장 (조각 11개 → 1개). src/lib/serif.ts 가 쓴다
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'}
q = urllib.parse.quote(''.join(c for c in text if c != ' ' and (c.isascii() or '가' <= c <= '힣' or c in '·…‘’“”')))
css = urllib.request.urlopen(urllib.request.Request(f'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500&text={q}&display=swap', headers=UA), timeout=30).read().decode()
urls = re.findall(r'url\((https://[^)]+)\)', css)
assert len(urls) == 1, f'명조 파일이 {len(urls)}개 — text= 응답이 바뀌었다'
SERIF.write_bytes(urllib.request.urlopen(urllib.request.Request(urls[0], headers=UA), timeout=30).read())
print(f'{SERIF.name}: {SERIF.stat().st_size // 1024}KB')
