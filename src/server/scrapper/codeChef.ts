
import { ContestType } from "@/lib/types";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
export async function scrapeCodeChefContests() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.codechef.com/contests", { waitUntil: "domcontentloaded" });

    const contests: ContestType[] = [];
    const html = await page.content();
    const $ = cheerio.load(html);

    // Upcoming contests table
    $("#future-contests tbody tr").each((_, row) => {
      const columns = $(row).find("td");

      const name = $(columns[1]).text().trim();
      const link = "https://www.codechef.com" + $(columns[1]).find("a").attr("href");
      const startTime = new Date($(columns[2]).text().trim());
      const id = link.split("/").pop() || "";

      contests.push({
        name,
        id,
        startTime,
        link,
        platform: "CodeChef",
      });
    });

    await browser.close();
    return contests;
  } catch (error) {
    console.error("CodeChef Scraping Error:", error);
    await browser.close();
    return [];
  }
}