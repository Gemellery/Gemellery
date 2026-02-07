import { Request, Response, NextFunction } from "express";

export const validateGem = (req: Request, res: Response, next: NextFunction) => {
    const {
        gem_name,
        gem_type,
        carat,
        cut,
        clarity,
        color,
        origin,
        price,
        description,
        ngja_certificate_no,
    } = req.body;

    // limits
    if (!gem_name || gem_name.length > 45)
        return res.status(400).json({ error: "Invalid gem_name" });

    if (gem_type && gem_type.length > 50)
        return res.status(400).json({ error: "Invalid gem_type" });

    if (cut && cut.length > 50)
        return res.status(400).json({ error: "Invalid cut" });

    if (clarity && clarity.length > 50)
        return res.status(400).json({ error: "Invalid clarity" });

    if (color && color.length > 50)
        return res.status(400).json({ error: "Invalid color" });

    if (origin && origin.length > 50)
        return res.status(400).json({ error: "Invalid origin" });

    if (ngja_certificate_no && ngja_certificate_no.length > 25)
        return res.status(400).json({ error: "Invalid NGJA number" });

    if (description && description.length > 255)
        return res.status(400).json({ error: "Description too long" });

    if (price && isNaN(price))
        return res.status(400).json({ error: "Invalid price" });

    if (carat && isNaN(carat))
        return res.status(400).json({ error: "Invalid carat" });

    next();
};
