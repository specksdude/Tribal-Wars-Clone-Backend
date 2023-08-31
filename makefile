clean:
	rm -rf ./build/

buildDocker:
	docker build -t monsters/monsters-gateway .
