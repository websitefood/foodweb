// controllers/recipeController.js
const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/* other functions unchanged ... */

async function getRecipePdf(req, res) {
  try {
    const slug = req.params.slug;
    const rr = await pool.query('SELECT * FROM recipes WHERE slug=$1', [slug]);
    if (!rr.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    const recipe = rr.rows[0];

    // Create PDF and pipe BEFORE ending
    const doc = new PDFDocument({ margin: 50 });

    // Set headers first
    res.setHeader('Content-disposition', `attachment; filename=${slug}.pdf`);
    res.setHeader('Content-type', 'application/pdf');

    // Pipe document directly to response
    doc.pipe(res);

    // Write content
    doc.fontSize(20).text(recipe.title || 'Recipe', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Prep: ${recipe.prep || 0} min   Cook: ${recipe.cook || 0} min`);
    doc.moveDown();
    doc.fontSize(14).text('Short description', { underline: true });
    doc.fontSize(12).text(recipe.short || '');
    doc.moveDown();
    doc.fontSize(14).text('Ingredients', { underline: true });
    (recipe.ingredients || '').split('\n').forEach(line => {
      if (line.trim()) doc.text('• ' + line);
    });
    doc.moveDown();
    doc.fontSize(14).text('Steps', { underline: true });
    (recipe.steps || '').split('\n').forEach((s, idx) => {
      if (s.trim()) doc.text(`${idx + 1}. ${s}`);
    });

    // Finalize PDF and end the stream
    doc.end();
    // do NOT call res.end() here; pdfkit will finish piping.
  } catch (e) {
    console.error('getRecipePdf error:', e);
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  createRecipe,
  listRecipes,
  getRecipeBySlug,
  addComment,
  listComments,
  likeRecipe,
  unlikeRecipe,
  relatedRecipes,
  getRecipePdf
};
