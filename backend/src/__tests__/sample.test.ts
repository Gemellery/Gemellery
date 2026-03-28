describe("Basic Backend Test", () => {
  it("should verify string operations", () => {
    const message = "Hello, Gemellery!";
    expect(message).toContain("Gemellery");
  });

  it("should perform simple math assertions", () => {
    expect(2 + 2).toBe(4);
  });
});
