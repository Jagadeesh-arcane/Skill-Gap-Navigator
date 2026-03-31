import { expect, test } from "@playwright/test";

test("can create a skill gap plan", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Target role").fill("Frontend Engineer");
  await page
    .getByPlaceholder("Add skill(s), e.g. Testing, TypeScript")
    .fill("React");
  await page.getByRole("button", { name: "Add skill", exact: true }).click();

  await page
    .getByPlaceholder("Add skill(s), e.g. Testing, TypeScript")
    .fill("TypeScript");
  await page.getByRole("button", { name: "Add skill", exact: true }).click();

  await page.getByRole("button", { name: "Compare skills" }).click();

  await expect(page.getByText("Skill gap analysis")).toBeVisible();
  await expect(page.getByText("React").first()).toBeVisible();
  await expect(page.getByText("TypeScript").first()).toBeVisible();
  await expect(page.getByText("Weekly plan (4 weeks)")).toBeVisible();
});
