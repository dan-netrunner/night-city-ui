import { cleanup, render } from "@testing-library/react";
import fc from "fast-check";
import { afterEach, describe, expect, it } from "vitest";
import { Progress } from "./Display";

afterEach(cleanup);

const finite = { noNaN: true, noDefaultInfinity: true } as const;

describe("Progress invariants (property-based)", () => {
  it("keeps the reading and the fill inside the track for any value", () => {
    fc.assert(
      fc.property(
        fc.double({ ...finite, min: -1e6, max: 1e6 }),
        fc.double({ ...finite, min: 0, max: 1e6 }),
        fc.integer({ min: 1, max: 40 }),
        (value, max, segments) => {
          const { container, unmount } = render(
            <Progress label="Load" value={value} max={max} segments={segments} segmented />,
          );
          const reading = container.querySelector(".cp-progress__value")?.textContent ?? "";
          const total = container.querySelectorAll(".cp-progress__seg").length;
          const filled = container.querySelectorAll(".cp-progress__seg.is-filled").length;
          const percent = Number.parseInt(reading, 10);
          const bar = container.querySelector('[role="progressbar"]');
          const now = Number(bar?.getAttribute("aria-valuenow"));
          unmount();

          expect(percent).toBeGreaterThanOrEqual(0);
          expect(percent).toBeLessThanOrEqual(100);
          expect(filled).toBeGreaterThanOrEqual(0);
          expect(filled).toBeLessThanOrEqual(total);
          expect(total).toBeGreaterThanOrEqual(4);
          expect(total).toBeLessThanOrEqual(24);
          expect(now).toBeGreaterThanOrEqual(0);
          expect(now).toBeLessThanOrEqual(Math.max(max, 100));
        },
      ),
      { numRuns: 100 },
    );
  });
});
