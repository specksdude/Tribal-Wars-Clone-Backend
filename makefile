clean:
	rm -rf ./build/

buildDocker:
	docker build -t monsters/monsters-gateway .

test:
	clear \
	&& npm run test:unit \
	&& npm run test:db \
	&& npm run test:e2e
