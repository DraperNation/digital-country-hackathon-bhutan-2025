async function main() {
  console.log("Deploying DrukCompanyRegistry...");
  
  const DrukCompanyRegistry = await ethers.getContractFactory("DrukCompanyRegistry");
  const registry = await DrukCompanyRegistry.deploy();
  
  await registry.deployed();
  
  console.log("DrukCompanyRegistry deployed to:", registry.address);
  console.log("Save this address for your frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 