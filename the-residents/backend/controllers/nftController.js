import asyncHandler from 'express-async-handler';
// Placeholder – integrate blockchain SDK later
export const mintResidencyNft = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // TODO: call smart-contract
  res.json({ message: 'NFT minted', tokenId: '0x123' });
});
