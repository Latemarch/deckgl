export default function hexToRgb(
  hex: string,
  opacity: number
): Uint8Array & number[] {
  // 16진수 색상 코드에서 # 제거
  let c = hex.substring(1);

  // 색상 코드가 3자리인 경우 6자리로 변환
  if (c.length === 3) {
    c = c
      .split("")
      .map((char: any) => char + char)
      .join("");
  }

  // 16진수를 RGB 값으로 변환
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // 배경색 설정 (여기서는 흰색 배경을 가정)
  const background = { r: 255, g: 255, b: 255 };

  // 투명도를 고려하여 최종 RGB 값 계산
  const finalR = Math.round((1 - opacity) * background.r + opacity * r);
  const finalG = Math.round((1 - opacity) * background.g + opacity * g);
  const finalB = Math.round((1 - opacity) * background.b + opacity * b);

  return [finalR, finalG, finalB] as Uint8Array & number[];
}

// 사용 예시
